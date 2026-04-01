import Groq from "groq-sdk";
import { ScoredStory } from "./scoreStories";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getTargetWords(score: number): number {
  if (score >= 8) return 900;
  if (score >= 5) return 600;
  return 400;
}

export async function generateScript(stories: ScoredStory[]): Promise<string> {
  const storyInstructions = stories
    .map((s, i) => {
      const words = getTargetWords(s.score);
      return `STORY ${i + 1} [${s.domain.toUpperCase()}] — ${s.title}
Source content: ${s.content.slice(0, 400)}
Target length: ~${words} words
`;
    })
    .join("\n");

  const prompt = `You are the host of Daily Brief, a 30-minute audio news show for Indian working professionals. Write a complete script for today's episode.

RULES:
1. Start with a warm 30-second intro: "Good morning, this is Daily Brief for [today's date]..."
2. For EACH story, write THREE clearly labelled layers:
   - Layer 1 opener: "Here is what happened..."
   - Layer 2 opener: "The mainstream view on this..."
   - Layer 3 opener: "A critical reading suggests..."
3. Use verbal fact-status cues throughout:
   - Confirmed by multiple sources → state it directly
   - Single source → "according to [source]"
   - Unverified → "reportedly"
   - Speculation → "analysts suggest"
4. Respect the target word count per story — longer for higher importance
5. End with a 30-second close: "That is your Daily Brief for today. You are informed. Have a great day."
6. Write in a calm, clear, conversational tone — this will be read aloud by a text-to-speech voice
7. Do NOT use bullet points, headers, or markdown — plain flowing prose only
8. Total script should be approximately 4500 words

STORIES TO COVER:
${storyInstructions}

Write the full script now:`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 6000,
  });

  const script = response.choices[0].message.content || "";
  console.log(`[generateScript] Generated script: ${script.split(" ").length} words`);
  return script;
}
