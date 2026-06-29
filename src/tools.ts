import fs from "fs/promises";
import fsS from "node:fs";
import path from "node:path";
import type { Tool } from "ollama";

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

function writeToFile(params: { filePath: string; content: string }): void {
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

export type ToolDef = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters?: {
      type: "object";
      properties: object;
      // Allow multiple string parameters (flexible)

      required?: string[];
    };
    invoke: (...args: any[]) => Promise<string> | string;
  };
};
export interface MyTool extends Tool {
  invoke: Function;
}
export const ToolRegistery = {} as { [key: string]: MyTool };

export function registerTool(toolDef: MyTool) {
  ToolRegistery[toolDef.function.name!] = toolDef;
}

registerTool({
  type: "function",
  function: {
    name: "getCurrentTime",
    description: "Get the current time",
  },
  invoke: getCurrentTime,
});
registerTool({
  type: "function",
  function: {
    name: "readFile",
    description: "Get the content of local file",
    parameters: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description: "The full path file name.",
        },
      },
    },
  },
  invoke: readFile,
});
registerTool({
  type: "function",
  function: {
    name: "getWeather",
    description: "Get the weather  of a given city",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name, e.g. Brisbane",
        },
      },
    },
  },
  invoke: getWeather,
});

registerTool({
  type: "function",
  function: {
    name: "writeToFile",
    description: "Write content to a local file",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The file name with full path",
        },
        content: {
          type: "string",
          description: "The content to write to the file",
        },
      },
    },
  },
  invoke: writeToFile,
});
