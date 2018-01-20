#!/usr/bin/env node
'use strict';

var makensis = require('makensis');

var _require = require('path'),
    extname = _require.extname;

// Functions


var compile = function compile(filePath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.compile(filePath, options).then(function (output) {
    log(output, options);
  }).catch(function (output) {
    if (options.json === true) {
      log(output, options);
    } else {
      console.error('Exit Code ' + output.status + '\n' + output.stderr);
    }
  });
};

var hdrinfo = function hdrinfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.hdrInfo(options).then(function (output) {
    // due to an error in makensis, this code should never run
    log(output, options);
  }).catch(function (output) {
    logError(output.stdout, options);
  });
};

var version = function version() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.version(options).then(function (output) {
    log(output, options);
  }).catch(function (output) {
    logError(output.stderr, options);
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
    logError(output.stderr, options);
  });
};

var log = function log(output, options) {
  if (options.json === true) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(output.stdout);
  }
};

var logError = function logError(output, options) {
  if (options.json === true) {
    console.error(JSON.stringify(output, null, 2));
  } else {
    console.error(output);
  }
};

var meta = require('../package.json');
var platform = require('os').platform;
var program = require('commander');

var validInputs = ['ACP', 'OEM', 'UTF8', 'UTF16BE', 'UTF16LE'];

// Action
program.version(meta.version).description('CLI version of node-makensis').arguments('[command] [file.nsi]').usage('[command] [file.nsi] [options]').option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>').option('-j, --json', 'prints output as JSON').option('-p, --pause', 'pauses after execution').option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]').option('-P, --ppo', 'preprocess to stdout/file').option('-S, --safe-ppo', 'preprocess to stdout/file').option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt).option('-w, --wine', 'use Wine to run makenis').option('-x, --strict', 'treat warnings as errors').action(function (cmd, filePath, flags) {

  var inputCharset = typeof flags.inputCharset !== 'undefined' && (validInputs.indexOf(flags.inputCharset) !== -1 || flags.inputCharset.match(/CP\d+/) !== null) ? flags.inputCharset : '';
  var noCD = typeof flags.nocd === 'undefined' ? false : true;
  var noConfig = typeof flags.noconfig === 'undefined' ? false : true;
  var outputCharset = '';
  var pause = typeof flags.pause === 'undefined' ? false : true;
  var ppo = typeof flags.ppo === 'undefined' ? false : true;
  var json = typeof flags.json === 'undefined' ? false : true;
  var safePPO = typeof flags.safePpo === 'undefined' ? false : true;
  var strict = typeof flags.strict === 'undefined' ? false : true;
  var verbose = flags.verbose >= 0 && flags.verbose <= 4 ? flags.verbose : null;
  var wine = typeof flags.wine === 'undefined' ? false : true;

  if (platform() === 'win32' || wine === true) {
    outputCharset = typeof flags.outputCharset !== 'undefined' ? flags.outputCharset : '';
  }

  var options = {
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
      cmdhelp(filePath, options);
      break;
    case 'h':
    case 'help':
      program.help();
    default:
      if (extname(cmd) === '.nsi' || extname(cmd) === '.bnsi') {
        compile(cmd, options);
        break;
      }

      program.help();
  }
}).parse(process.argv);

if (program.args.length === 0) program.help();