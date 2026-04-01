import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function generateAudio(script: string, date: string): Promise<string> {
  const fileName = `${date}.mp3`;
  const outputDir = path.join(process.cwd(), "public", "episodes");
  const outputPath = path.join(outputDir, fileName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const scriptFile = path.join(process.cwd(), "data", `script-${date}.txt`);
  fs.writeFileSync(scriptFile, script, "utf-8");

  console.log(`[tts] Generating audio for ${date}...`);

  const { stderr } = await execAsync(
    `python3 -m edge_tts --voice en-IN-NeerjaNeural --rate=+10% --file "${scriptFile}" --write-media "${outputPath}"`,
    { timeout: 600000 }
  );

  if (stderr) {
    console.warn(`[tts] stderr: ${stderr}`);
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error(`[tts] Audio file was not created at ${outputPath}`);
  }

  const stats = fs.statSync(outputPath);
  console.log(`[tts] Audio generated: ${fileName} (${Math.round(stats.size / 1024)}kb)`);

  fs.unlinkSync(scriptFile);

  return `/episodes/${fileName}`;
}
