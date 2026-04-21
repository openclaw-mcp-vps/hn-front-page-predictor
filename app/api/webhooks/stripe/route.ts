import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordPurchase } from "@/lib/database";

export const runtime = "nodejs";

function verifyStripeSignature(payload: string, signatureHeader: string | null, secret: string | undefined) {
  if (!secret) return true;
  if (!signatureHeader) return false;

  const components = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const timestamp = components.t;
  const signature = components.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: {
      id?: string;
      customer_email?: string;
      customer_details?: {
        email?: string;
      };
      created?: number;
    };
  };
};

function parseStripePurchase(event: StripeEvent) {
  if (event.type !== "checkout.session.completed" && event.type !== "payment_link.paid") {
    return null;
  }

  const object = event.data?.object;
  const email = object?.customer_details?.email ?? object?.customer_email;
  if (!email) return null;

  return {
    email,
    eventId: event.id,
    checkoutId: object?.id,
    paidAt: typeof object?.created === "number" ? new Date(object.created * 1000).toISOString() : new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const stripeSignature = request.headers.get("stripe-signature");

  const valid = verifyStripeSignature(payload, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return NextResponse.json({ success: false, error: "Invalid Stripe signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(payload) as StripeEvent;
    const purchase = parseStripePurchase(event);

    if (purchase) {
      await recordPurchase({
        email: purchase.email,
        provider: "stripe",
        eventId: purchase.eventId,
        checkoutId: purchase.checkoutId,
        paidAt: purchase.paidAt
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Malformed Stripe payload." }, { status: 400 });
  }
}
