import { spawn as _spawn } from "child_process";

export const spawn = (cmd: string, options?: string[]) => {
  const process = _spawn(cmd, options);

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  process.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
