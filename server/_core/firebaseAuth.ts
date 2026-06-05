import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { createRequire } from "module";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// firebase-admin is a CommonJS package; use createRequire to load it in ESM context
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseAdmin = require("firebase-admin") as typeof import("firebase-admin");

let adminInitialized = false;

function getAdmin() {
  if (!adminInitialized) {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("VITE_FIREBASE_PROJECT_ID is not set");
    }
    // Initialize without service account — projectId is sufficient for ID token verification
    firebaseAdmin.initializeApp({ projectId });
    adminInitialized = true;
  }
  return firebaseAdmin;
}

export function registerFirebaseAuthRoutes(app: Express) {
  /**
   * POST /api/auth/firebase
   * Body: { idToken: string }
   * Verifies the Firebase ID token, upserts the user, and issues a session cookie.
   */
  app.post("/api/auth/firebase", async (req: Request, res: Response) => {
    const { idToken } = req.body as { idToken?: string };

    if (!idToken || typeof idToken !== "string") {
      res.status(400).json({ error: "idToken is required" });
      return;
    }

    try {
      const admin = getAdmin();
      const decoded = await admin.auth().verifyIdToken(idToken);

      const uid = decoded.uid;
      const name = (decoded.name as string | undefined) || decoded.email?.split("@")[0] || "Usuario";
      const email = decoded.email || null;

      // Derive login method from Firebase sign-in provider
      const provider = (decoded.firebase as any)?.sign_in_provider ?? "";
      let loginMethod = "email";
      if (provider.includes("google")) loginMethod = "google";
      else if (provider.includes("facebook")) loginMethod = "facebook";

      // Prefix UID to avoid collisions with Manus openIds
      const openId = `firebase_${uid}`;

      await db.upsertUser({
        openId,
        name,
        email,
        loginMethod,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, name });
    } catch (error) {
      console.error("[Firebase Auth] Token verification failed", error);
      res.status(401).json({ error: "Invalid Firebase token" });
    }
  });
}
