import { exec as _exec, ExecException } from "child_process";

export const exec =
  (cmd: string) =>
  (onCallback: (output: string) => void, onError: (e: ExecException) => void) =>
    _exec(cmd, (error, stdout) => {
      if (error) return onError(error);
      return onCallback(stdout);
    });
