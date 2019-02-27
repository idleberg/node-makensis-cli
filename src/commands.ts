import * as makensis from 'makensis';
import * as yeoman from 'yeoman-environment';

// Exports
const cmdhelp = (command: string = '', options: CompilerOptions = {}): void => {
  Object.assign(options, { verbose: 0 });

  makensis.cmdHelp(command, options)
  .then(output => {
    log(output.stdout, options);
  }).catch(output => {
    // fallback for NSIS < 3.03
    logError(output.stdout, options);
  });
};

const compile = (filePath: string, options: CompilerOptions = {}): void => {
  Object.assign(options, {});

  makensis.compile(filePath, options)
  .then(output => {
    if (options.json === true) {
      log(output, options);
    } else {
      log(output.stdout, options);
    }
  }).catch(output => {
    if (options.json === true) {
      log(output, options);
    } else {
      console.error(`Exit Code ${output.status}\n${output.stderr}`);
    }
  });
};

const hdrinfo = (options: CompilerOptions = {}): void => {
  Object.assign(options, { verbose: 0 });

  makensis.hdrInfo(options)
  .then(output => {
    log(output.stdout, options);
  }).catch(output => {
    // fallback for NSIS < 3.03
    logError(output.stdout, options);
  });
};

const license = (options: CompilerOptions = {}): void => {
  Object.assign(options, {});

  makensis.license(options)
  .then(output => {
    log(output.stdout, options);
  }).catch(output => {
    logError(output.stderr, options);
  });
};

const nsisdir = (options: CompilerOptions = {}): void => {
  makensis.nsisDir(options)
  .then(output => {
    log(output, options);
  }).catch(output => {
    // fallback for NSIS < 3.03
    logError(output, options);
  });
};

const scaffold = (): void => {
  const env = yeoman.createEnv();

  env.register(require.resolve('generator-nsis'), 'nsis:app');
  env.run('nsis:app');
};

const version = (options: CompilerOptions = {}): void => {
  Object.assign(options, { verbose: 0 });

  makensis.version(options)
  .then(output => {
    log(output.stdout, options);
  }).catch(output => {
    logError(output.stderr, options);
  });
};

export {
  cmdhelp,
  compile,
  hdrinfo,
  license,
  nsisdir,
  scaffold,
  version
};

// Helpers
const log = (output, options): void => {
  if (options.json === true) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(output);
  }
};

const logError = (output, options): void => {
  if (options.json === true) {
    console.error(JSON.stringify(output, null, 2));
  } else {
    console.error(output);
  }
};
