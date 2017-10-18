import * as program from 'commander';
import { compile, hdrinfo, cmdhelp, version } from './util';
const meta = require('../package.json');

const validCharsets = [
  'ACP',
  'OEM',
  'UTF8',
  'UTF16BE',
  'UTF16LE'
];

program
  .version(meta.version)
  .description('CLI version of node-makensis')
  .arguments('<cmd> [file.nsi]>')
  .usage('<cmd> [file.nsi] [options]')
  .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16[LE|BE]')
  .option('-j, --json', 'print hdrinfo as JSON')
  .option('-p, --pause', 'pauses after execution')
  .option('-P, --ppo', 'preprocess to stdout/file')
  .option('-S, --safe-ppo', 'preprocess to stdout/file')
  .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
  .option('-w, --wine', 'use Wine to run makenis')
  .option('-x, --strict', 'treat warnings as errors')
  .action(function(cmd, filePath, flags) {

    let inputCharset: any = (typeof flags.inputCharset !== 'undefined' && (validCharsets.indexOf(flags.inputCharset) !== -1 || flags.inputCharset.match(/CP\d+/) !== null)) ? flags.inputCharset : '';
    let noCD = (typeof flags.nocd === 'undefined') ? false : true;
    let noConfig = (typeof flags.noconfig === 'undefined') ? false : true;
    let pause = (typeof flags.pause === 'undefined') ? false : true;
    let ppo = (typeof flags.ppo === 'undefined') ? false : true;
    let json = (typeof flags.json === 'undefined') ? false : true;
    let safePPO = (typeof flags.safePpo === 'undefined') ? false : true;
    let strict = (typeof flags.strict === 'undefined') ? false : true;
    let verbose = (flags.verbose >= 0 && flags.verbose <= 4) ? flags.verbose : null;
    let wine = (typeof flags.wine === 'undefined') ? false : true;

    const options = {
      'inputCharset': inputCharset,
      'json': json,
      'noCD': noCD,
      'noConfig': noConfig,
      'pause': pause,
      'ppo': ppo,
      'safePPO': safePPO,
      'strict': strict,
      'verbose': verbose,
      'wine': wine
    };

    switch (cmd) {
      case 'build':
      case 'c':
      case 'compile':
      case 'm':
      case 'make':
        compile(filePath, options);
        break;
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
      case 'h':
      case 'cmdhelp':
      case 'help':
        cmdhelp(filePath, options);
        break;
      default:
        program.help();
        break;
    }
  })
.parse(process.argv);

if (program.args.length === 0) program.help();
