import fs from "fs";
import path from "path";

const EPISODES_FILE = path.join(process.cwd(), "data", "episodes.json");
const MAX_EPISODES = 30;

export interface Episode {
  date: string;
  title: string;
  audioPath: string;
  stories: {
    title: string;
    domain: string;
    score: number;
  }[];
  createdAt: string;
}

export function readEpisodes(): Episode[] {
  try {
    const raw = fs.readFileSync(EPISODES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveEpisode(episode: Episode): void {
  const episodes = readEpisodes();
  episodes.unshift(episode);

  if (episodes.length > MAX_EPISODES) {
    const removed = episodes.splice(MAX_EPISODES);
    removed.forEach((e) => {
      const audioFile = path.join(process.cwd(), "public", e.audioPath);
      if (fs.existsSync(audioFile)) {
        fs.unlinkSync(audioFile);
        console.log(`[episodes] Purged old audio: ${e.audioPath}`);
      }
    });
  }

  fs.writeFileSync(EPISODES_FILE, JSON.stringify(episodes, null, 2));
  console.log(`[episodes] Saved episode: ${episode.date}`);
}

export function getEpisodeByDate(date: string): Episode | null {
  const episodes = readEpisodes();
  return episodes.find((e) => e.date === date) ?? null;
}

export function getRecentEpisodes(count: number = 7): Episode[] {
  return readEpisodes().slice(0, count);
}
