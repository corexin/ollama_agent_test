import fs from "fs/promises";
import fsS from "node:fs";
import path from "node:path";

export function getCurrentTime(): string {
  return new Date().toString();
}

export function getWeather(params: { city: string }): string {
  return "its Sunny for " + params.city;
}

export async function readFile(params: { fileName: string }): Promise<string> {
  if (!params.fileName) {
    return "Error: No file path provided.";
  }

  try {
    const isWindowsHost = process.platform === "win32";
    let normalizedPath;

    // Optional: resolve relative paths
    const fName = path.resolve(params.fileName);

    if (isWindowsHost) {
      // If running on Windows, force path processing via the win32 subsystem
      normalizedPath = path.win32.normalize(fName);
    } else {
      // If running on Linux/Mac/Docker, transform all backslashes '\' into forward slashes '/'
      // This allows Unix to read "C:\temp\test.txt" strings sent by an LLM gracefully
      const unifiedPath = fName.replace(/\\/g, "/");

      // Clean up any double slash anomalies (like //)
      normalizedPath = path.posix.normalize(unifiedPath);
    }

    // 1. Verify if the file actually exists before trying to open it
    await fs.access(normalizedPath);

    // 2. Read the file into memory as plain text
    const content = await fs.readFile(normalizedPath, "utf-8");
    return content;
  } catch (error) {
    // Gracefully handle common errors like ENOENT (File Not Found) or EACCES (Permission Denied)
    console.log(error);
    return `Error accessing file at "${params.fileName}": ${error}`;
  }
}

export function writeToFile(params: {
  filePath: string;
  content: string;
}): void {
  try {
    // Create directory if it doesn't exist
    const dirname = path.dirname(params.filePath);
    if (!fsS.existsSync(dirname)) {
      fsS.mkdirSync(dirname, { recursive: true });
    }

    fsS.writeFileSync(params.filePath, params.content, "utf8");
    console.log(`✅ Successfully wrote to: ${params.filePath}`);
  } catch (error) {
    console.error(`❌ Failed to write file ${params.filePath}:`, error);
  }
}
