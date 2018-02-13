declare module '*.json' {
    const value: any;
    export default value;
}

interface CompilerOptions {
  // makensis
  define?: Object;
  inputCharset?: string;
  json?: boolean;
  noCD?: boolean;
  noConfig?: boolean;
  outputCharset?: string;
  pause?: boolean;
  postExecute?: Array<string>;
  preExecute?: Array<string>;
  ppo?: boolean;
  safePPO?: boolean;
  strict?: boolean;
  verbose?: number;
  wine?: boolean;

  // child_process
  cwd?: string;
  detached?: boolean;
  shell?: string;

  // library
  pathToMakensis?: string;
}
