import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchNews";
import { scoreStories } from "@/lib/scoreStories";
import { selectStories } from "@/lib/selectStories";
import { generateScript } from "@/lib/generateScript";
import { generateAudio } from "@/lib/tts";
import { saveEpisode } from "@/lib/episodes";
import { sendTelegramMessage } from "@/lib/telegram";

export const maxDuration = 300;

export async function GET() {
  const date = new Date().toISOString().split("T")[0];
  console.log(`\n===== Daily Brief Pipeline Starting: ${date} =====`);

  try {
    console.log("[pipeline] Step 1: Fetching news...");
    const rawStories = await fetchNews();
    if (!rawStories.length) {
      throw new Error("No stories fetched — aborting pipeline");
    }

    console.log("[pipeline] Step 2: Scoring stories...");
    const scoredStories = await scoreStories(rawStories);

    console.log("[pipeline] Step 3: Selecting stories...");
    const selectedStories = selectStories(scoredStories);

    console.log("[pipeline] Step 4: Generating script...");
    const script = await generateScript(selectedStories);
    if (!script || script.length < 500) {
      throw new Error("Script too short or empty — aborting pipeline");
    }

    console.log("[pipeline] Step 5: Generating audio...");
    const audioPath = await generateAudio(script, date);

    console.log("[pipeline] Step 6: Saving episode metadata...");
    const episode = {
      date,
      title: selectedStories[0].title,
      audioPath,
      stories: selectedStories.map((s) => ({
        title: s.title,
        domain: s.domain,
        score: s.score,
      })),
      createdAt: new Date().toISOString(),
    };
    saveEpisode(episode);

    console.log("[pipeline] Step 7: Sending Telegram message...");
    await sendTelegramMessage(episode);

    console.log("===== Pipeline Complete =====\n");

    return NextResponse.json({
      success: true,
      episode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[pipeline] FAILED: ${message}`);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
