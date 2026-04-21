import { createHmac, timingSafeEqual } from "node:crypto";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

let configured = false;

export function setupLemonSqueezy() {
  if (configured) return;
  if (process.env.LEMONSQUEEZY_API_KEY) {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });
  }
  configured = true;
}

export function verifyLemonSqueezySignature(payload: string, signature: string | null, secret: string | undefined) {
  if (!secret) return true;
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = signature;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

interface LemonSqueezyEvent {
  meta?: { event_name?: string };
  data?: {
    id?: string;
    attributes?: {
      user_email?: string;
      created_at?: string;
    };
  };
}

export function parseLemonSqueezyPurchase(payload: LemonSqueezyEvent) {
  const event = payload.meta?.event_name;
  if (event !== "order_created" && event !== "subscription_created") {
    return null;
  }

  const email = payload.data?.attributes?.user_email;
  if (!email) return null;

  return {
    email,
    eventId: `${event}:${payload.data?.id ?? "unknown"}`,
    checkoutId: payload.data?.id,
    paidAt: payload.data?.attributes?.created_at ?? new Date().toISOString()
  };
}
