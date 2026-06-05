import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(userId = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `user-${userId}`,
      email: `user${userId}@example.com`,
      name: `Usuario ${userId}`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

// Unique plate number to avoid collisions between test runs
const TEST_PLATE = `TEST-${Date.now()}`;

describe("plates.search", () => {
  it("returns empty results for unknown plate number", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.plates.search({ plateNumber: "ZZZ-9999-NOTEXIST" });
    expect(result).toHaveProperty("lost");
    expect(result).toHaveProperty("found");
    expect(Array.isArray(result.lost)).toBe(true);
    expect(Array.isArray(result.found)).toBe(true);
    expect(result.lost.length).toBe(0);
    expect(result.found.length).toBe(0);
  });
});

describe("plates.listFound", () => {
  it("returns an array of found plates", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.plates.listFound({ limit: 5, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("plates — create and search", () => {
  it("creates a lost plate and finds it by number", async () => {
    const caller = appRouter.createCaller(createAuthContext(42));

    // Create a lost plate
    const created = await caller.plates.reportLost({
      plateNumber: TEST_PLATE,
      description: "Test plate for unit test",
      incidentDate: new Date().toISOString(),
    });
    expect(created).toHaveProperty("id");
    expect(typeof created.id).toBe("number");

    // Search for it
    const publicCaller = appRouter.createCaller(createPublicContext());
    const results = await publicCaller.plates.search({ plateNumber: TEST_PLATE });
    expect(results.lost.length).toBeGreaterThanOrEqual(1);
    expect(results.lost[0].plateNumber).toBe(TEST_PLATE);
  });

  it("creates a found plate and it appears in listFound", async () => {
    const foundPlate = `FOUND-${Date.now()}`;
    const caller = appRouter.createCaller(createAuthContext(43));

    await caller.plates.reportFound({
      plateNumber: foundPlate,
      description: "Found plate for unit test",
      incidentDate: new Date().toISOString(),
      locationApprox: "Zona de prueba",
    });

    const publicCaller = appRouter.createCaller(createPublicContext());
    const list = await publicCaller.plates.listFound({ limit: 50, offset: 0 });
    const found = list.find((p) => p.plateNumber === foundPlate);
    expect(found).toBeDefined();
    expect(found?.type).toBe("found");
  });
});

describe("messaging — start conversation and send message", () => {
  it("creates a found plate and allows another user to start a conversation", async () => {
    const foundPlate = `MSG-${Date.now()}`;
    const ownerCaller = appRouter.createCaller(createAuthContext(50));
    const finderCaller = appRouter.createCaller(createAuthContext(51));

    // User 51 reports a found plate
    const created = await finderCaller.plates.reportFound({
      plateNumber: foundPlate,
      description: "Messaging test plate",
      incidentDate: new Date().toISOString(),
    });
    expect(created).toHaveProperty("id");

    // User 50 starts a conversation with user 51
    const conv = await ownerCaller.messaging.startConversation({
      foundPlateId: created.id,
      initialMessage: "Hola, creo que esa placa es mía.",
    });
    expect(conv).toHaveProperty("conversationId");
    expect(typeof conv.conversationId).toBe("number");

    // User 51 replies
    const reply = await finderCaller.messaging.sendMessage({
      conversationId: conv.conversationId,
      content: "Sí, la tengo. ¿Cómo coordinamos?",
    });
    expect(reply).toHaveProperty("id");

    // User 50 reads the messages
    const msgs = await ownerCaller.messaging.getMessages({
      conversationId: conv.conversationId,
    });
    expect(msgs.length).toBeGreaterThanOrEqual(2);
    expect(msgs[0].content).toBe("Hola, creo que esa placa es mía.");
    expect(msgs[1].content).toBe("Sí, la tengo. ¿Cómo coordinamos?");
    // Aliases must be anonymous (no real names)
    for (const msg of msgs) {
      expect(msg.senderAlias).toMatch(/^Usuario #\d+$/);
    }
  });
});

describe("messaging.unreadCount", () => {
  it("returns a number for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext(999));
    const count = await caller.messaging.unreadCount();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe("plates.myPlates", () => {
  it("returns an array for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext(999));
    const plates = await caller.plates.myPlates();
    expect(Array.isArray(plates)).toBe(true);
  });
});
