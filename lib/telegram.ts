export async function sendTelegramMessage(episode: {
  date: string;
  title: string;
  audioPath: string;
}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const userId = process.env.TELEGRAM_USER_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!botToken || !userId || !baseUrl) {
    throw new Error("[telegram] Missing TELEGRAM_BOT_TOKEN, TELEGRAM_USER_ID, or NEXT_PUBLIC_BASE_URL");
  }

  const playerUrl = `${baseUrl}/player/${episode.date}`;

  const message = `🎙 *Daily Brief — ${episode.date}*

📰 ${episode.title}

Your 30-minute briefing is ready. Tap to listen:
👉 ${playerUrl}

_Business • Tech • Finance • Politics_`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: userId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`[telegram] API error: ${JSON.stringify(result)}`);
  }

  console.log(`[telegram] Message sent to user ${userId}`);
}
