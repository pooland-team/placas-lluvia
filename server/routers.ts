import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  countUnreadMessages,
  createConversation,
  createMessage,
  createPlate,
  getConversationById,
  getConversationByPlateAndUsers,
  getConversationMessages,
  getPlateById,
  getUserById,
  getUserConversations,
  getUserPlates,
  listFoundPlates,
  markMessagesAsRead,
  searchPlatesByNumber,
  updatePlateStatus,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { storagePut } from "./storage";

// ─── File Upload ──────────────────────────────────────────────────────────────

const uploadRouter = router({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        base64: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const key = `plates/${Date.now()}-${input.filename}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
});

// ─── Plates ───────────────────────────────────────────────────────────────────

const platesRouter = router({
  listFound: publicProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
    .query(async ({ input }) => {
      const rows = await listFoundPlates(input.limit ?? 20, input.offset ?? 0);
      return rows;
    }),

  search: publicProcedure
    .input(z.object({ plateNumber: z.string().min(1) }))
    .query(async ({ input }) => {
      return searchPlatesByNumber(input.plateNumber);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const plate = await getPlateById(input.id);
      if (!plate) throw new TRPCError({ code: "NOT_FOUND" });
      // Fetch reporter name (display alias, not personal data)
      const reporter = await getUserById(plate.userId);
      return {
        ...plate,
        reporterAlias: `Usuario #${plate.userId}`,
      };
    }),

  reportLost: protectedProcedure
    .input(
      z.object({
        plateNumber: z.string().min(1).max(20),
        description: z.string().optional(),
        incidentDate: z.string(),
        photoUrl: z.string().optional(),
        photoKey: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await createPlate({
        userId: ctx.user.id,
        type: "lost",
        plateNumber: input.plateNumber.trim().toUpperCase(),
        description: input.description ?? null,
        incidentDate: new Date(input.incidentDate),
        photoUrl: input.photoUrl ?? null,
        photoKey: input.photoKey ?? null,
        locationApprox: null,
        status: "active",
      });

      // Check if there are already found reports for this plate
      const matches = await searchPlatesByNumber(input.plateNumber);
      if (matches.found.length > 0) {
        await notifyOwner({
          title: "¡Placa encontrada disponible!",
          content: `Alguien ya reportó haber encontrado la placa ${input.plateNumber.toUpperCase()}. Revisa los reportes en la plataforma.`,
        });
      }

      return result;
    }),

  reportFound: protectedProcedure
    .input(
      z.object({
        plateNumber: z.string().min(1).max(20),
        description: z.string().optional(),
        incidentDate: z.string(),
        photoUrl: z.string().optional(),
        photoKey: z.string().optional(),
        locationApprox: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await createPlate({
        userId: ctx.user.id,
        type: "found",
        plateNumber: input.plateNumber.trim().toUpperCase(),
        description: input.description ?? null,
        incidentDate: new Date(input.incidentDate),
        photoUrl: input.photoUrl ?? null,
        photoKey: input.photoKey ?? null,
        locationApprox: input.locationApprox ?? null,
        status: "active",
      });

      // Notify owner if there's a lost report for this plate
      const matches = await searchPlatesByNumber(input.plateNumber);
      if (matches.lost.length > 0) {
        await notifyOwner({
          title: "Placa encontrada",
          content: `Se reportó una placa encontrada con número ${input.plateNumber.toUpperCase()} que coincide con un reporte de pérdida. Revisa la plataforma.`,
        });
      }

      return result;
    }),

  myPlates: protectedProcedure.query(async ({ ctx }) => {
    return getUserPlates(ctx.user.id);
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "claimed", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plate = await getPlateById(input.id);
      if (!plate) throw new TRPCError({ code: "NOT_FOUND" });
      if (plate.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" });
      await updatePlateStatus(input.id, input.status);
      return { success: true };
    }),
});

// ─── Conversations & Messages ─────────────────────────────────────────────────

const messagingRouter = router({
  startConversation: protectedProcedure
    .input(
      z.object({
        foundPlateId: z.number(),
        lostPlateId: z.number().optional(),
        initialMessage: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const foundPlate = await getPlateById(input.foundPlateId);
      if (!foundPlate) throw new TRPCError({ code: "NOT_FOUND" });
      if (foundPlate.userId === ctx.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No puedes contactarte contigo mismo",
        });

      // Reuse existing conversation if any
      let conv = await getConversationByPlateAndUsers(
        input.foundPlateId,
        ctx.user.id,
        foundPlate.userId
      );

      if (!conv) {
        const created = await createConversation({
          foundPlateId: input.foundPlateId,
          lostPlateId: input.lostPlateId ?? null,
          initiatorId: ctx.user.id,
          responderId: foundPlate.userId,
          status: "open",
        });
        conv = await getConversationById(created.id);
      }

      if (!conv) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await createMessage({
        conversationId: conv.id,
        senderId: ctx.user.id,
        content: input.initialMessage,
        read: false,
      });

      return { conversationId: conv.id };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conv = await getConversationById(input.conversationId);
      if (!conv) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        conv.initiatorId !== ctx.user.id &&
        conv.responderId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (conv.status === "closed")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Esta conversación está cerrada",
        });

      const result = await createMessage({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        content: input.content,
        read: false,
      });

      return result;
    }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const conv = await getConversationById(input.conversationId);
      if (!conv) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        conv.initiatorId !== ctx.user.id &&
        conv.responderId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await markMessagesAsRead(input.conversationId, ctx.user.id);
      const msgs = await getConversationMessages(input.conversationId);

      // Attach sender alias (first name only, no personal data)
      const senderIds = Array.from(new Set(msgs.map((m) => m.senderId)));
      const senderMap: Record<number, string> = {};
      for (const sid of senderIds) {
        const u = await getUserById(sid);
        // Use anonymous alias based on user ID to protect personal data
        senderMap[sid] = `Usuario #${sid}`;
      }

      return msgs.map((m) => ({
        ...m,
        senderAlias: senderMap[m.senderId] ?? "Usuario",
        isMine: m.senderId === ctx.user.id,
      }));
    }),

  myConversations: protectedProcedure.query(async ({ ctx }) => {
    const convs = await getUserConversations(ctx.user.id);
    const result = [];
    for (const conv of convs) {
      const plate = await getPlateById(conv.foundPlateId);
      const otherUserId =
        conv.initiatorId === ctx.user.id ? conv.responderId : conv.initiatorId;
      const other = await getUserById(otherUserId);
      const msgs = await getConversationMessages(conv.id);
      const lastMsg = msgs[msgs.length - 1];
      result.push({
        ...conv,
        plateNumber: plate?.plateNumber ?? "—",
        otherAlias: `Usuario #${otherUserId}`,
        lastMessage: lastMsg?.content ?? null,
        lastMessageAt: lastMsg?.createdAt ?? conv.createdAt,
      });
    }
    return result;
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    return countUnreadMessages(ctx.user.id);
  }),
});

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  upload: uploadRouter,
  plates: platesRouter,
  messaging: messagingRouter,
});

export type AppRouter = typeof appRouter;
