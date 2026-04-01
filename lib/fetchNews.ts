import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY! });

const DOMAINS = ["business", "technology", "finance", "politics"];

export interface RawStory {
  title: string;
  content: string;
  url: string;
  domain: string;
  publishedDate?: string;
}

export async function fetchNews(): Promise<RawStory[]> {
  const today = new Date().toISOString().split("T")[0];

  const results = await Promise.all(
    DOMAINS.map(async (domain) => {
      const response = await client.search(
        `top ${domain} news India ${today}`,
        {
          maxResults: 5,
          searchDepth: "basic",
          includeAnswer: false,
        }
      );

      return response.results.map((r) => ({
        title: r.title || "",
        content: r.content || "",
        url: r.url || "",
        domain,
        publishedDate: r.publishedDate,
      }));
    })
  );

  const allStories = results.flat();
  console.log(`[fetchNews] Fetched ${allStories.length} stories across 4 domains`);
  return allStories;
}
