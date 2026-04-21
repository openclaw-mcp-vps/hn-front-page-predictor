import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAccessCookie } from "@/lib/auth";
import { hasPurchaseForEmail } from "@/lib/database";

export const runtime = "nodejs";

const claimSchema = z.object({
  email: z.string().email()
});

function redirectWithClaimStatus(request: NextRequest, status: string) {
  const redirectUrl = new URL("/predict", request.url);
  redirectUrl.searchParams.set("claim", status);
  return NextResponse.redirect(redirectUrl, 303);
}

async function extractEmail(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { email?: string };
    return body.email ?? "";
  }

  const formData = await request.formData();
  const email = formData.get("email");
  return typeof email === "string" ? email : "";
}

export async function POST(request: NextRequest) {
  try {
    const emailValue = await extractEmail(request);
    const parsed = claimSchema.safeParse({ email: emailValue });

    if (!parsed.success) {
      return redirectWithClaimStatus(request, "invalid-email");
    }

    const hasPurchase = await hasPurchaseForEmail(parsed.data.email);
    if (!hasPurchase) {
      return redirectWithClaimStatus(request, "not-found");
    }

    const cookie = buildAccessCookie(parsed.data.email);
    const response = redirectWithClaimStatus(request, "success");
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return redirectWithClaimStatus(request, "not-found");
  }
}
