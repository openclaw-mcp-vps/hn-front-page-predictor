import { createHmac, timingSafeEqual } from "node:crypto";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const ACCESS_COOKIE_NAME = "hnfp_access";
const ACCESS_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

interface AccessTokenPayload {
  email: string;
  exp: number;
}

function getAccessSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "dev-access-secret-change-me";
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getAccessSecret()).update(encodedPayload).digest("base64url");
}

export function createAccessToken(email: string) {
  const payload: AccessTokenPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ACCESS_COOKIE_TTL_SECONDS
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAccessToken(token: string | undefined | null): AccessTokenPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as AccessTokenPayload;
    if (typeof parsed.exp !== "number" || typeof parsed.email !== "string") return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function buildAccessCookie(email: string): {
  name: string;
  value: string;
  options: Partial<ResponseCookie>;
} {
  return {
    name: ACCESS_COOKIE_NAME,
    value: createAccessToken(email),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_COOKIE_TTL_SECONDS
    }
  };
}

export function hasAccessCookie(token: string | undefined) {
  return Boolean(verifyAccessToken(token));
}
