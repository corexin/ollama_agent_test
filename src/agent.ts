import ollama, {
  type ChatRequest,
  type ChatResponse,
  type Message,
  type Tool,
  type ToolCall,
} from "ollama";
import { ToolRegistery } from "./tool/toolRegistry.js";
import { parseArgs } from "node:util";
import { invokeLLM } from "./llm.js";
import { loadPrompt } from "./prompt/loader.js";
import { log_tool, log_final } from "./log/logger.js";
type ToolCallDef = {
  id: string;
  function: Function;
};

const roleAndMessages: Message[] = [
  {
    role: "system",
    content: loadPrompt("system.md"),
  },
];
export async function askLLM(question: string) {
  let finalAnswer: string = "";
  roleAndMessages.push({
    role: "user",
    content: question,
  });

  while (true) {
    const response = await invokeLLM(roleAndMessages);

    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCallsList =
        (response.message.tool_calls as ToolCallDef[]) || [];

      roleAndMessages.push(response.message);

      for (const toolCall of toolCallsList) {
        const toolCallId: string = toolCall?.id;
        if (!toolCallId) continue;

        const requestedToolName: string = toolCall?.function?.name;
        if (!requestedToolName) continue;

        const rawArgs = toolCall?.function?.arguments || null;
        const parsedArgs =
          typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs;

        log_tool(`Tool: Tool call ${requestedToolName} received`);

        let invokeResult =
          await ToolRegistery[requestedToolName]?.invoke(parsedArgs);
        log_tool(`Tool: Invoke ends`);
        roleAndMessages.push({
          role: "tool",
          tool_name: requestedToolName,
          content: invokeResult,
        });
      }
      continue;
    } else {
      finalAnswer = response.message.content;
      log_final("Final answer:\n" + finalAnswer);
      break;
    }
  }
  return finalAnswer;
}

await askLLM(
  "hello, what is the weather in Brisbane?what time is it now? display file list in current directory'",
);
