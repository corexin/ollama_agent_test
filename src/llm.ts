import Ollama, { type ChatResponse, type Message } from "ollama";
import { ToolRegistery } from "./tools.js";
import { log_llm, log_tool } from "./log/logger.js";
export const invokeLLM = async (
  roleAndMessages: Message[],
): Promise<ChatResponse> => {
  log_llm("Ollama: Asking...");
  const response = await Ollama.chat({
    model: "qwen2.5:3b-instruct",
    messages: roleAndMessages,
    tools: Object.values(ToolRegistery),
  });
  // Log the response for debugging purposes
  log_llm("Ollama: replied."); // Log the response for debugging purposes
  return response;
};
