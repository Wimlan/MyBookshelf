import assert from "node:assert/strict";
import { test } from "node:test";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import type { TokenPayload, VerifyIdTokenOptions } from "google-auth-library";
import { createGoogleIdTokenVerifier } from "./googleAuth.ts";

const clientId = "test-client.apps.googleusercontent.com";
const payload: TokenPayload = {
  iss: "https://accounts.google.com",
  aud: clientId,
  sub: "google-subject",
  email: "test@example.com",
  email_verified: true,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

test("Google verifier passes the token and audience to Google and returns the app identity", async (t) => {
  t.mock.method(
    OAuth2Client.prototype,
    "verifyIdToken",
    async (options: VerifyIdTokenOptions) => {
      assert.deepEqual(options, {
        idToken: "test-id-token",
        audience: clientId,
      });
      return new LoginTicket("", payload);
    },
  );
  const identity = await createGoogleIdTokenVerifier(clientId)("test-id-token");
  assert.deepEqual(identity, {
    sub: payload.sub,
    email: payload.email,
    issuedAt: payload.iat * 1000,
    expiresAt: payload.exp * 1000,
  });
});

test("Google verifier rejects invalid tokens and unverified or missing emails", async (t) => {
  const withoutEmail = { ...payload };
  delete withoutEmail.email;
  t.mock.method(
    OAuth2Client.prototype,
    "verifyIdToken",
    async ({ idToken }: VerifyIdTokenOptions) => {
      if (idToken === "invalid") throw new Error("Invalid token signature");
      const tokenPayload =
        idToken === "unverified"
          ? { ...payload, email_verified: false }
          : withoutEmail;
      return new LoginTicket("", tokenPayload);
    },
  );
  const verifyIdToken = createGoogleIdTokenVerifier(clientId);
  for (const idToken of ["invalid", "unverified", "missing-email"]) {
    assert.equal(await verifyIdToken(idToken), null);
  }
});

test("Google key-service failures are surfaced instead of treated as invalid ID tokens", async (t) => {
  const error = Object.assign(new Error("Key service unavailable"), {
    code: "ECONNRESET",
  });
  t.mock.method(OAuth2Client.prototype, "verifyIdToken", async () => {
    throw error;
  });
  await assert.rejects(
    createGoogleIdTokenVerifier(clientId)("test-id-token"),
    error,
  );
});
