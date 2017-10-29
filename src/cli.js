#!/usr/bin/env node

const makensis = require('makensis');
const YAML = require('yamljs');

// Functions
const compile = (filePath, options = null) => {
  options || (options = {});

  makensis.compile(filePath, options)
  .then(output => {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.error(`Exit Code ${output.status}\n${output.stderr}`);
    }
  });
};

const hdrinfo = (options = null) => {
  options || (options = {});

  makensis.hdrInfo(options)
  .then(output => {
    // due to an error in makensis, this code should never run
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  });
};

const version = (options = null) => {
  options || (options = {});

  makensis.version(options)
  .then(output => {
    if (options.target !== null) {
      printString(output.stdout, options.target, 'version');
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'error');
    } else {
      console.error(output.stderr);
    }
  });
};

const cmdhelp = (title = '', options = null) => {
  options || (options = {});

  makensis.cmdHelp(title, options)
  .then(output => {
    // due to an error in makensis, this code should never run
    return;
  }).catch(output => {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'help');
    } else {
      console.error(output.stderr);
    }
  });
};

const printString = (input, target = 'json', key = null) => {
  let obj = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }
  if (key === null) {
    obj = input;
  } else {
    obj[key] = input;
  }

  let output;
  if (target === 'yaml') {
    output = YAML.stringify(obj);
  } else {
    output = JSON.stringify(obj, null, '  ');
  }

  console.log(output);
};

const printFlags = (input, target = 'json') => {
  let lines = input.split('\n');

  let filteredLines = lines.filter((line) => {
    if (line !== '') {
      return line;
    }
  });

  let lastLine = filteredLines.pop();
  // console.log(lines);
  // console.log(lastLine);

  const prefix = 'Defined symbols: ';

  let lineData = lastLine.substring(prefix.length);
  let symbols = lineData.split(',');
  // console.log(symbols);

  let table = {};
  let tableSizes = {};
  let tableSymbols = {};

  // Split sizes
  filteredLines.forEach((line) => {
    let pair = line.split(' is ');
    pair[0] = pair[0].replace('Size of ', '');
    pair[0] = pair[0].replace(' ', '_');
    pair[1] = pair[1].substring(-1, pair[1].length - 1);

    let obj = {};
    tableSizes[pair[0]] = pair[1];
    // tableSizes.push(pair);
  });

  let objSizes = {};
  table['sizes'] = tableSizes;
  // table.push(objSizes);

  // Split symbols
  symbols.forEach((symbol) => {
    let pair = symbol.split('=');
    let obj = {};

    if (pair.length > 1) {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  let obj = {};
  table['defined_symbols'] = tableSymbols;
  // table.push(obj);

  const config = {
    columns: {
      0: {
        alignment: 'center',
        minWidth: 10
      },
      1: {
        alignment: 'center',
        minWidth: 10
      }
    }
  };

  let output;
  if (target === 'yaml') {
    output = YAML.stringify(table);
  } else {
    output = JSON.stringify(table, null, '  ');
  }

  console.log(output);
};

const isInteger = (x) => {
  return x % 2 === 0;
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
  .arguments('<command> [file.nsi]>')
  .usage('<command> [file.nsi] [options]')
  .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
  .option('-j, --json', 'prints output as JSON')
  .option('-p, --pause', 'pauses after execution')
  .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
  .option('-P, --ppo', 'preprocess to stdout/file')
  .option('-S, --safe-ppo', 'preprocess to stdout/file')
  .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
  .option('-w, --wine', 'use Wine to run makenis')
  .option('-x, --strict', 'treat warnings as errors')
  .option('-y, --yaml', 'prints output as YAML')
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
    let yaml = (typeof flags.yaml === 'undefined') ? false : true;

    if (platform() === 'win32' || wine === true) {
      outputCharset = (typeof flags.outputCharset !== 'undefined' ? flags.outputCharset : '';
    }

    let target = null;
    if (yaml === true && json === false) {
      target = 'yaml'
    } else if (json === true && yaml === false) {
      target = 'json'
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
      'target': target,
      'verbose': verbose,
      'wine': wine,
      'yaml': yaml
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
