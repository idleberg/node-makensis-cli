"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
var program = require("commander");
var path_1 = require("path");
var os_1 = require("os");
// Local exports
var meta = require('../package.json');
var commands_1 = require("./commands");
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
    if (os_1.platform() === 'win32' || wine === true) {
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
            commands_1.hdrinfo(options);
            break;
        case 'v':
        case 'version':
            commands_1.version(options);
            break;
        case 'cmdhelp':
        case 'help':
            filePath = (typeof filePath === 'undefined') ? '' : filePath;
            commands_1.cmdhelp(filePath, options);
            break;
        case 'h':
        case 'help':
            program.help();
            break;
        case 'd':
        case 'dir':
        case 'nsisdir':
            commands_1.nsisdir(options);
            break;
            break;
        case 'l':
        case 'license':
            commands_1.license(options);
            break;
        default:
            if (typeof cmd !== 'undefined' && (path_1.extname(cmd) === '.nsi' || path_1.extname(cmd) === '.bnsi')) {
                commands_1.compile(cmd, options);
                break;
            }
            program.help();
    }
})
    .parse(process.argv);
if (program.args.length === 0)
    program.help();
