"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makensis = require("makensis");
var path_1 = require("path");
// Functions
var compile = function (filePath, options) {
    if (options === void 0) { options = {}; }
    Object.assign(options, {});
    makensis.compile(filePath, options)
        .then(function (output) {
        if (options.json === true) {
            log(output, options);
        }
        else {
            log(output.stdout, options);
        }
    }).catch(function (output) {
        if (options.json === true) {
            log(output, options);
        }
        else {
            console.error("Exit Code " + output.status + "\n" + output.stderr);
        }
    });
};
var hdrinfo = function (options) {
    if (options === void 0) { options = {}; }
    Object.assign(options, { verbose: 0 });
    makensis.hdrInfo(options)
        .then(function (output) {
        log(output.stdout, options);
    }).catch(function (output) {
        // fallback for NSIS < 3.03
        logError(output.stdout, options);
    });
};
var version = function (options) {
    if (options === void 0) { options = {}; }
    Object.assign(options, { verbose: 0 });
    makensis.version(options)
        .then(function (output) {
        log(output.stdout, options);
    }).catch(function (output) {
        logError(output.stderr, options);
    });
};
var cmdhelp = function (command, options) {
    if (command === void 0) { command = ''; }
    if (options === void 0) { options = {}; }
    Object.assign(options, { verbose: 0 });
    makensis.cmdHelp(command, options)
        .then(function (output) {
        log(output.stdout, options);
    }).catch(function (output) {
        // fallback for NSIS < 3.03
        logError(output.stdout, options);
    });
};
var log = function (output, options) {
    if (options.json === true) {
        console.log(JSON.stringify(output, null, 2));
    }
    else {
        console.log(output);
    }
};
var logError = function (output, options) {
    if (options.json === true) {
        console.error(JSON.stringify(output, null, 2));
    }
    else {
        console.error(output);
    }
};
var meta = require('../package.json');
var platform = require('os').platform;
var program = require('commander');
var validInputs = [
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
    .action(function (cmd, filePath, flags) {
    var inputCharset = (typeof flags.inputCharset !== 'undefined' && (validInputs.indexOf(flags.inputCharset) !== -1 || flags.inputCharset.match(/CP\d+/) !== null)) ? flags.inputCharset : '';
    var noCD = (typeof flags.nocd === 'undefined') ? false : true;
    var noConfig = (typeof flags.noconfig === 'undefined') ? false : true;
    var outputCharset = '';
    var pause = (typeof flags.pause === 'undefined') ? false : true;
    var ppo = (typeof flags.ppo === 'undefined') ? false : true;
    var json = (typeof flags.json === 'undefined') ? false : true;
    var safePPO = (typeof flags.safePpo === 'undefined') ? false : true;
    var strict = (typeof flags.strict === 'undefined') ? false : true;
    var verbose = (flags.verbose >= 0 && flags.verbose <= 4) ? flags.verbose : null;
    var wine = (typeof flags.wine === 'undefined') ? false : true;
    if (platform() === 'win32' || wine === true) {
        outputCharset = (typeof flags.outputCharset !== 'undefined') ? flags.outputCharset : '';
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
            filePath = (typeof filePath === 'undefined') ? '' : filePath;
            cmdhelp(filePath, options);
            break;
        case 'h':
        case 'help':
            program.help();
            break;
        default:
            if (path_1.extname(cmd) === '.nsi' || path_1.extname(cmd) === '.bnsi') {
                compile(cmd, options);
                break;
            }
            program.help();
    }
})
    .parse(process.argv);
if (program.args.length === 0)
    program.help();
