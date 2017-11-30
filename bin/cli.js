#!/usr/bin/env node
'use strict';

var makensis = require('makensis');

var _require = require('makensis/dist/util'),
    objectifyFlags = _require.objectifyFlags;

// Functions


var compile = function compile(filePath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.compile(filePath, options).then(function (output) {
    log(output, options.target);
  }).catch(function (output) {
    if (options.target === 'json') {
      log(output, options.target);
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
    log(output.stdout, options.target);
  }).catch(function (output) {
    logError(output.stdout, options.target);
  });
};

var version = function version() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.version(options).then(function (output) {
    log(output.stdout, options.target);
  }).catch(function (output) {
    logError(output.stderr, options.target);
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
    logError(output.stderr, options.target);
  });
};

var log = function log(output, target) {
  if (target === 'json') {
    console.log(JSON.stringify(output, null, '  '));
  } else {
    console.log(output);
  }
};

var logError = function logError(output, target) {
  if (target === 'json') {
    console.error(JSON.stringify(output, null, '  '));
  } else {
    console.error(output);
  }
};

var meta = require('../package.json');
var platform = require('os').platform;
var program = require('commander');

var validInputs = ['ACP', 'OEM', 'UTF8', 'UTF16BE', 'UTF16LE'];

// Action
program.version(meta.version).description('CLI version of node-makensis').arguments('<command> [file.nsi]>').usage('<command> [file.nsi] [options]').option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>').option('-j, --json', 'prints output as JSON').option('-p, --pause', 'pauses after execution').option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]').option('-P, --ppo', 'preprocess to stdout/file').option('-S, --safe-ppo', 'preprocess to stdout/file').option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt).option('-w, --wine', 'use Wine to run makenis').option('-x, --strict', 'treat warnings as errors').action(function (cmd, filePath, flags) {

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

  var target = json === true ? 'json' : null;

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
    'target': target,
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
}).parse(process.argv);

if (program.args.length === 0) program.help();