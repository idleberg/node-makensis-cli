#!/usr/bin/env node
'use strict';

var makensis = require('makensis');
var meta = require('../package.json');
var program = require('commander');
var YAML = require('yamljs');

// Functions
var compile = function compile(filePath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.compile(filePath, options).then(function (output) {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.error('Exit Code ' + output.status + '\n' + output.stderr);
    }
  });
};

var hdrinfo = function hdrinfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.hdrInfo().then(function (output) {
    // due to an error in makensis, this code should never run
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  });
};

var version = function version() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.version(options).then(function (output) {
    if (options.target !== null) {
      printString(output.stdout, options.target, 'version');
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'error');
    } else {
      console.error(output.stderr);
    }
  });
};

var cmdhelp = function cmdhelp() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.cmdHelp(title, options).then(function (output) {
    // due to an error in makensis, this code should never run
    return;
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'help');
    } else {
      console.error(output.stderr);
    }
  });
};

var printString = function printString(input) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var obj = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }
  if (key === null) {
    obj = input;
  } else {
    obj[key] = input;
  }

  var output = void 0;
  if (target === 'yaml') {
    output = YAML.stringify(obj);
  } else {
    output = JSON.stringify(obj, null, '  ');
  }

  console.log(output);
};

var printFlags = function printFlags(input) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';

  var lines = input.split('\n');

  var filteredLines = lines.filter(function (line) {
    if (line !== '') {
      return line;
    }
  });

  var lastLine = filteredLines.pop();
  // console.log(lines);
  // console.log(lastLine);

  var prefix = 'Defined symbols: ';

  var lineData = lastLine.substring(prefix.length);
  var symbols = lineData.split(',');
  // console.log(symbols);

  var table = {};
  var tableSizes = {};
  var tableSymbols = {};

  // Split sizes
  filteredLines.forEach(function (line) {
    var pair = line.split(' is ');
    pair[0] = pair[0].replace('Size of ', '');
    pair[0] = pair[0].replace(' ', '_');
    pair[1] = pair[1].substring(-1, pair[1].length - 1);

    var obj = {};
    tableSizes[pair[0]] = pair[1];
    // tableSizes.push(pair);
  });

  var objSizes = {};
  table['sizes'] = tableSizes;
  // table.push(objSizes);

  // Split symbols
  symbols.forEach(function (symbol) {
    var pair = symbol.split('=');
    var obj = {};

    if (pair.length > 1) {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  var obj = {};
  table['defined_symbols'] = tableSymbols;
  // table.push(obj);

  var config = {
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

  var output = void 0;
  if (target === 'yaml') {
    output = YAML.stringify(table);
  } else {
    output = JSON.stringify(table, null, '  ');
  }

  console.log(output);
};

var isInteger = function isInteger(x) {
  return x % 2 === 0;
};

var validCharsets = ['ACP', 'OEM', 'UTF8', 'UTF16BE', 'UTF16LE'];

// Action
program.version(meta.version).description('CLI version of node-makensis').arguments('<command> [file.nsi]>').usage('<command> [file.nsi] [options]').option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16[LE|BE]').option('-j, --json', 'prints output as JSON').option('-p, --pause', 'pauses after execution').option('-P, --ppo', 'preprocess to stdout/file').option('-S, --safe-ppo', 'preprocess to stdout/file').option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt).option('-w, --wine', 'use Wine to run makenis').option('-x, --strict', 'treat warnings as errors').option('-y, --yaml', 'prints output as YAML').action(function (cmd, filePath, flags) {

  var inputCharset = typeof flags.inputCharset !== 'undefined' && (validCharsets.indexOf(flags.inputCharset) !== -1 || flags.inputCharset.match(/CP\d+/) !== null) ? flags.inputCharset : '';
  var noCD = typeof flags.nocd === 'undefined' ? false : true;
  var noConfig = typeof flags.noconfig === 'undefined' ? false : true;
  var pause = typeof flags.pause === 'undefined' ? false : true;
  var ppo = typeof flags.ppo === 'undefined' ? false : true;
  var json = typeof flags.json === 'undefined' ? false : true;
  var safePPO = typeof flags.safePpo === 'undefined' ? false : true;
  var strict = typeof flags.strict === 'undefined' ? false : true;
  var verbose = flags.verbose >= 0 && flags.verbose <= 4 ? flags.verbose : null;
  var wine = typeof flags.wine === 'undefined' ? false : true;
  var yaml = typeof flags.yaml === 'undefined' ? false : true;

  var target = null;
  if (yaml === true && json === false) {
    target = 'yaml';
  } else if (json === true && yaml === false) {
    target = 'json';
  }

  var options = {
    'inputCharset': inputCharset,
    'json': json,
    'noCD': noCD,
    'noConfig': noConfig,
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
}).parse(process.argv);

if (program.args.length === 0) program.help();