type ColorType =
  | "reset"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "bold"
  | "gray";

// Color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
} as const;

function log(color: ColorType, message: string) {
  console.log(colors[color] + message + colors.reset);
}

export function log_final(message: string) {
  log("blue", `🎉 ${message}`);
}
export const log_tool = (message: string): void => {
  log("magenta", `🔧 ${message}`);
};

export const log_llm = (message: string): void => {
  log("green", `🔍 ${message}`);
};
