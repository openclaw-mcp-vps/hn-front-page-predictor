import { NextRequest, NextResponse } from "next/server";
import { parseLemonSqueezyPurchase, setupLemonSqueezy, verifyLemonSqueezySignature } from "@/lib/lemonsqueezy";
import { recordPurchase } from "@/lib/database";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-signature");

  setupLemonSqueezy();

  const validSignature = verifyLemonSqueezySignature(body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  if (!validSignature) {
    return NextResponse.json({ success: false, error: "Invalid signature." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body);
    const purchase = parseLemonSqueezyPurchase(payload);

    if (purchase) {
      await recordPurchase({
        email: purchase.email,
        provider: "lemonsqueezy",
        eventId: purchase.eventId,
        checkoutId: purchase.checkoutId,
        paidAt: purchase.paidAt
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Malformed webhook payload." }, { status: 400 });
  }
}
