import Groq from "groq-sdk";
import { RawStory } from "./fetchNews";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ScoredStory extends RawStory {
  score: number;
  reasoning: string;
}

export async function scoreStories(stories: RawStory[]): Promise<ScoredStory[]> {
  const prompt = `You are a news editor for Indian working professionals. Score each story below from 1-10 based on:
- Significance: how many people are affected
- Novelty: is this genuinely new information
- Consequence: does this change something important

Return ONLY valid JSON array, no other text. Format:
[{"index": 0, "score": 8, "reasoning": "brief reason"}, ...]

Stories:
${stories.map((s, i) => `${i}. [${s.domain.toUpperCase()}] ${s.title}\n${s.content.slice(0, 200)}`).join("\n\n")}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content || "[]";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const scores: { index: number; score: number; reasoning: string }[] = JSON.parse(clean);

    const scored = stories.map((story, i) => {
      const match = scores.find((s) => s.index === i);
      return {
        ...story,
        score: match?.score ?? 5,
        reasoning: match?.reasoning ?? "",
      };
    });

    console.log(`[scoreStories] Scored ${scored.length} stories`);
    return scored;
  } catch (e) {
    console.error("[scoreStories] Failed to parse scores, using default score 5", e);
    return stories.map((s) => ({ ...s, score: 5, reasoning: "" }));
  }
}
