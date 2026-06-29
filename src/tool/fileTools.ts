import { execFile } from "child_process";
import path from "path";

interface LLMFilePayload {
  target_directory: string;
  files: string[];
}

/**
 * Lists files in a target directory using PowerShell securely.
 * @param {string} targetPath - The absolute or relative path to scan.
 */
export function getFilesForLLM(params: {
  targetPath: string;
}): Promise<string> | null {
  return new Promise<string>((resolve, reject) => {
    // Resolve and normalize the path to absolute format
    const absolutePath = path.resolve(params.targetPath);

    // PowerShell arguments structured safely as an array
    const args = [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Get-ChildItem -LiteralPath '${absolutePath}' -File | Select-Object -ExpandProperty Name | ConvertTo-Json`,
    ];

    // Use execFile to target powershell.exe directly with arguments
    execFile("powershell.exe", args, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Powershell Error: ${error || stderr}`);
        return;
      }

      const trimmedOutput = stdout.trim();
      if (!trimmedOutput) {
        console.log("No files found in the directory.");
        return;
      }

      try {
        // Parse result into a clean structure
        const fileList = JSON.parse(trimmedOutput);

        resolve(
          JSON.stringify({
            target_directory: absolutePath,
            files: Array.isArray(fileList) ? fileList : [fileList],
          }),
        );
      } catch (parseError) {
        console.log("Data ready for LLM (Fallback):", [trimmedOutput]);
      }
    });
  });
}
