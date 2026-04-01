import { ScoredStory } from "./scoreStories";

const DOMAINS = ["business", "technology", "finance", "politics"];

export function selectStories(stories: ScoredStory[]): ScoredStory[] {
  const sorted = [...stories].sort((a, b) => b.score - a.score);
  const selected: ScoredStory[] = [];

  for (const domain of DOMAINS) {
    const top = sorted.find(
      (s) => s.domain === domain && !selected.includes(s)
    );
    if (top) selected.push(top);
  }

  for (const story of sorted) {
    if (selected.length >= 6) break;
    if (!selected.includes(story)) selected.push(story);
  }

  selected.sort((a, b) => b.score - a.score);

  console.log(
    `[selectStories] Selected ${selected.length} stories:`,
    selected.map((s) => `[${s.domain}] ${s.title} (${s.score})`)
  );

  return selected;
}
