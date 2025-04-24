import { analyzeUrl } from "@/lib/actions";
import { type NextRequest, NextResponse } from "next/server";

// Augmenter la durée maximale d'exécution à 60 secondes
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const result = await analyzeUrl(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
