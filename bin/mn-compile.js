#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var commands_1 = require("./commands");
var os_1 = require("os");
var charsets_1 = require("./charsets");
// Action
program
    .usage('[script(s)] [options]')
    .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
    .option('-j, --json', 'prints output as JSON')
    .option('-W, --pause', 'pauses after execution')
    .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
    .option('-P, --ppo', 'preprocess to stdout/file')
    .option('-S, --safe-ppo', 'safely preprocess to stdout/file')
    .option('-p, --priority <n>', 'process priority, where n is 5=realtime,4=high,3=above normal,2=normal,1=below normal,0=idle', parseInt)
    .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
    .option('-w, --wine', 'use Wine to run makensis')
    .option('-x, --strict', 'treat warnings as errors')
    .parse(process.argv);
var inputCharset = (typeof program.inputCharset !== 'undefined' && charsets_1.input.includes(program.inputCharset.toUpperCase())) ? program.inputCharset.toUpperCase() : '';
var noCD = (typeof program.nocd === 'undefined') ? false : true;
var noConfig = (typeof program.noconfig === 'undefined') ? false : true;
var outputCharset = (typeof program.outputCharset !== 'undefined' && charsets_1.output.includes(program.outputCharset.toUpperCase())) ? program.outputCharset.toUpperCase() : '';
var pause = (typeof program.pause === 'undefined') ? false : true;
var ppo = (typeof program.ppo === 'undefined') ? false : true;
var priority = (program.priority >= 0 && program.priority <= 5) ? program.priority : null;
var json = (typeof program.json === 'undefined') ? false : true;
var safePPO = (typeof program.safePpo === 'undefined') ? false : true;
var strict = (typeof program.strict === 'undefined') ? false : true;
var verbose = (program.verbose >= 0 && program.verbose <= 4) ? program.verbose : null;
var wine = (typeof program.wine === 'undefined') ? false : true;
if (os_1.platform() === 'win32' || wine === true) {
    outputCharset = (typeof program.outputCharset !== 'undefined') ? program.outputCharset : '';
    priority = (typeof program.priority !== 'undefined') ? program.priority : '';
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
    'priority': priority,
    'strict': strict,
    'verbose': verbose,
    'wine': wine
};
if (program.args.length) {
    program.args.forEach(function (scriptFile) {
        commands_1.compile(scriptFile, options);
    });
}
else {
    program.help();
}
