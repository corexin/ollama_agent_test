import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getDirname = () => process.cwd();

export const loadPrompt = (filename: string): string => {
  const filePath = path.join(getDirname(), "src/prompt", filename);
  console.log(`Loading system prompt file: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8").trim();
};
