import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as admin from "firebase-admin";

let adminInitialized = false;

function getFirebaseAdmin() {
  if (!adminInitialized) {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("VITE_FIREBASE_PROJECT_ID is not set");
    }
    // Initialize without service account — uses project ID only for token verification
    admin.initializeApp({ projectId });
    adminInitialized = true;
  }
  return admin;
}

export function registerFirebaseAuthRoutes(app: Express) {
  /**
   * POST /api/auth/firebase
   * Body: { idToken: string }
   * Verifies the Firebase ID token, upserts the user, and sets the session cookie.
   */
  app.post("/api/auth/firebase", async (req: Request, res: Response) => {
    const { idToken } = req.body as { idToken?: string };

    if (!idToken || typeof idToken !== "string") {
      res.status(400).json({ error: "idToken is required" });
      return;
    }

    try {
      const firebaseAdmin = getFirebaseAdmin();
      const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

      const uid = decoded.uid;
      const name = decoded.name || decoded.email?.split("@")[0] || "Usuario";
      const email = decoded.email || null;

      // Derive login method from Firebase sign-in provider
      const provider = decoded.firebase?.sign_in_provider ?? "";
      let loginMethod = "email";
      if (provider.includes("google")) loginMethod = "google";
      else if (provider.includes("facebook")) loginMethod = "facebook";

      // Use Firebase UID as openId (prefixed to avoid collisions with Manus openIds)
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
