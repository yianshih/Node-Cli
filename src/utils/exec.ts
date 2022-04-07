import { exec as _exec, ExecException } from "child_process";

export const exec =
  (cmd: string) =>
  (
    onCallback: (output: string) => void,
    onError: (e: ExecException, output?: string) => void
  ) =>
    _exec(cmd, (error, stdout, stderr) => {
      if (error) return onError(error, stderr);
      return onCallback(stdout);
    });
