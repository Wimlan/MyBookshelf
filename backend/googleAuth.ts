import { OAuth2Client } from "google-auth-library";

export interface GoogleIdentity {
  sub: string;
  email: string;
  expiresAt: number;
  issuedAt: number;
}

export type VerifyGoogleIdToken = (
  idToken: string,
) => Promise<GoogleIdentity | null>;

export function createGoogleIdTokenVerifier(
  clientId: string,
): VerifyGoogleIdToken {
  const client = new OAuth2Client(clientId);

  return async (idToken) => {
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
    } catch (error) {
      const isServiceError =
        error !== null &&
        typeof error === "object" &&
        ("code" in error || "response" in error);
      if (isServiceError) throw error;
      return null;
    }

    const payload = ticket.getPayload();
    if (!payload) return null;
    const { sub, email, email_verified, exp, iat } = payload;
    const isValidIdentity =
      typeof sub === "string" &&
      sub.length > 0 &&
      typeof email === "string" &&
      email.length > 0 &&
      email.length <= 255 &&
      email_verified === true &&
      typeof exp === "number" &&
      typeof iat === "number";

    if (!isValidIdentity) return null;

    return {
      sub,
      email,
      expiresAt: exp * 1000,
      issuedAt: iat * 1000,
    };
  };
}
