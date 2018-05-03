import * as makensis from 'makensis';
import { extname } from 'path';

// Functions
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

const version = (options: CompilerOptions = {}): void => {
  Object.assign(options, { verbose: 0 });

  makensis.version(options)
  .then(output => {
    log(output.stdout, options);
  }).catch(output => {
    logError(output.stderr, options);
  });
};

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

const meta = require('../package.json');
const platform = require('os').platform;
const program = require('commander');

const validInputs = [
  'ACP',
  'OEM',
  'UTF8',
  'UTF16BE',
  'UTF16LE'
];

// Action
program
  .version(meta.version)
  .description('CLI version of node-makensis')
  .arguments('[command] [file.nsi]')
  .usage('[command] [file.nsi] [options]')
  .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
  .option('-j, --json', 'prints output as JSON')
  .option('-p, --pause', 'pauses after execution')
  .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
  .option('-P, --ppo', 'preprocess to stdout/file')
  .option('-S, --safe-ppo', 'safely preprocess to stdout/file')
  .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
  .option('-w, --wine', 'use Wine to run makenis')
  .option('-x, --strict', 'treat warnings as errors')
  .action(function(cmd, filePath, flags) {

    let inputCharset = (typeof flags.inputCharset !== 'undefined' && (validInputs.indexOf(flags.inputCharset) !== -1 || flags.inputCharset.match(/CP\d+/) !== null)) ? flags.inputCharset : '';
    let noCD = (typeof flags.nocd === 'undefined') ? false : true;
    let noConfig = (typeof flags.noconfig === 'undefined') ? false : true;
    let outputCharset = '';
    let pause = (typeof flags.pause === 'undefined') ? false : true;
    let ppo = (typeof flags.ppo === 'undefined') ? false : true;
    let json = (typeof flags.json === 'undefined') ? false : true;
    let safePPO = (typeof flags.safePpo === 'undefined') ? false : true;
    let strict = (typeof flags.strict === 'undefined') ? false : true;
    let verbose = (flags.verbose >= 0 && flags.verbose <= 4) ? flags.verbose : null;
    let wine = (typeof flags.wine === 'undefined') ? false : true;

    if (platform() === 'win32' || wine === true) {
      outputCharset = (typeof flags.outputCharset !== 'undefined') ? flags.outputCharset : '';
    }

    const options = {
      'inputCharset': inputCharset,
      'json': json,
      'noCD': noCD,
      'noConfig': noConfig,
      'outputCharset': outputCharset,
      'pause': pause,
      'ppo': ppo,
      'safePPO': safePPO,
      'strict': strict,
      'verbose': verbose,
      'wine': wine
    };

    switch (cmd) {
      case 'f':
      case 'flags':
      case 'hdrinfo':
      case 'i':
      case 'info':
        hdrinfo(options);
        break;
      case 'v':
      case 'version':
        version(options);
        break;
      case 'cmdhelp':
      case 'help':
        filePath = (typeof filePath === 'undefined') ? '' : filePath;
        cmdhelp(filePath, options);
        break;
      case 'h':
      case 'help':
        program.help();
        break;
      default:
        if (extname(cmd) === '.nsi' || extname(cmd) === '.bnsi') {
          compile(cmd, options);
          break;
        }

        program.help();
    }
  })
.parse(process.argv);

if (program.args.length === 0) program.help();
