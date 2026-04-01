import { getEpisodeByDate } from "@/lib/episodes";
import { notFound } from "next/navigation";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const episode = getEpisodeByDate(date);

  if (!episode) {
    notFound();
  }

  const domainColors: Record<string, string> = {
    business: "bg-blue-100 text-blue-800",
    technology: "bg-purple-100 text-purple-800",
    finance: "bg-green-100 text-green-800",
    politics: "bg-orange-100 text-orange-800",
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        <p className="text-gray-400 text-sm mb-1">Daily Brief</p>
        <h1 className="text-2xl font-bold mb-1">{date}</h1>
        <p className="text-gray-300 text-sm mb-6">{episode.title}</p>

        <audio
          controls
          autoPlay={false}
          className="w-full mb-8 rounded-lg"
          src={episode.audioPath}
        >
          Your browser does not support the audio element.
        </audio>

        <h2 className="text-lg font-semibold mb-3">Stories in this episode</h2>
        <div className="space-y-3">
          {episode.stories.map((story, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    domainColors[story.domain] ?? "bg-gray-700 text-gray-200"
                  }`}
                >
                  {story.domain}
                </span>
                <span className="text-gray-500 text-xs">Score: {story.score}/10</span>
              </div>
              <p className="text-sm text-gray-200">{story.title}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          You are informed. Have a great day. ✓
        </p>
      </div>
    </main>
  );
}
