import { NextRequest, NextResponse } from "next/server";
import { hasAccessCookie, ACCESS_COOKIE_NAME } from "@/lib/auth";
import { predictionInputSchema, predictShowHN } from "@/lib/ml-model";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unlocked = hasAccessCookie(request.cookies.get(ACCESS_COOKIE_NAME)?.value);

  if (!unlocked) {
    return NextResponse.json(
      {
        success: false,
        error: "Upgrade required. Purchase access to run the predictor."
      },
      { status: 402 }
    );
  }

  try {
    const body = await request.json();
    const parsed = predictionInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid input payload."
        },
        { status: 400 }
      );
    }

    const result = predictShowHN(parsed.data);

    return NextResponse.json({
      success: true,
      result
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to run prediction right now."
      },
      { status: 500 }
    );
  }
}
