import { getRecentEpisodes } from "@/lib/episodes";
import Link from "next/link";

export default function Home() {
  const episodes = getRecentEpisodes(7);

  const domainColors: Record<string, string> = {
    business: "bg-blue-100 text-blue-800",
    technology: "bg-purple-100 text-purple-800",
    finance: "bg-green-100 text-green-800",
    politics: "bg-orange-100 text-orange-800",
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-1">Daily Brief</h1>
        <p className="text-gray-400 text-sm mb-8">
          Your 30-minute audio news companion
        </p>

        {episodes.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-gray-400">No episodes yet.</p>
            <p className="text-gray-600 text-sm mt-1">
              The first briefing will arrive at 6am.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => (
              <Link key={episode.date} href={`/player/${episode.date}`}>
                <div className="bg-gray-900 hover:bg-gray-800 transition rounded-lg p-4 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">{episode.date}</span>
                    <span className="text-xs text-gray-600">30 min</span>
                  </div>
                  <p className="text-sm font-medium text-white mb-3">
                    {episode.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {episode.stories.map((s, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          domainColors[s.domain] ?? "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {s.domain}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
