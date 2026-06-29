import type { Tool } from "ollama";
import { getCurrentTime, readFile, getWeather, writeToFile } from "./tools.js";
import { getFilesForLLM } from "./fileTools.js";
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
registerTool({
  type: "function",
  function: {
    name: "getFilesForLLM",
    description: "Get file list from given directory",
    parameters: {
      type: "object",
      properties: {
        targetPath: {
          type: "string",
          description: "The file name with full path",
        },
      },
    },
  },
  invoke: getFilesForLLM,
});
