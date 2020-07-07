#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var getStdin = require("get-stdin");
var commands_1 = require("./commands");
var os_1 = require("os");
var charsets_1 = require("./charsets");
function parseCommands(value) {
    var trimmedValue = value.trim();
    try {
        return JSON.parse(trimmedValue);
    }
    catch (e) {
        return trimmedValue;
    }
}
// Action
program
    .usage('[script(s)] [options]')
    .option('-i, --input-charset <string>', 'ACP|OEM|CP#|UTF8|UTF16<LE|BE>')
    .option('-j, --json', 'prints output as JSON')
    .option('-W, --pause', 'pauses after execution')
    .option('-o, --output-charset <string>', 'ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]')
    .option('-P, --ppo', 'preprocess to stdout/file')
    .option('-S, --safe-ppo', 'safely preprocess to stdout/file')
    .option('-b, --pre-execute <string>', 'executes script-commands before script', parseCommands)
    .option('-a, --post-execute <string>', 'executes script-commands after script', parseCommands)
    .option('-p, --priority <n>', 'process priority, where n is 5=realtime,4=high,3=above normal,2=normal,1=below normal,0=idle', parseInt)
    .option('-v, --verbose <n>', 'verbosity where n is 4=all,3=no script,2=no info,1=no warnings,0=none', parseInt)
    .option('-w, --wine', 'use Wine to run makensis')
    .option('-x, --strict', 'treat warnings as errors')
    .parse(process.argv);
var inputCharset = (typeof program.inputCharset !== 'undefined' && charsets_1.input.includes(program.inputCharset.toUpperCase())) ? program.inputCharset.toUpperCase() : '';
var json = (typeof program.json === 'undefined') ? false : true;
var noCD = (typeof program.nocd === 'undefined') ? false : true;
var noConfig = (typeof program.noconfig === 'undefined') ? false : true;
var pause = (typeof program.pause === 'undefined') ? false : true;
var ppo = (typeof program.ppo === 'undefined') ? false : true;
var safePPO = (typeof program.safePpo === 'undefined') ? false : true;
var strict = (typeof program.strict === 'undefined') ? false : true;
var verbose = (program.verbose >= 0 && program.verbose <= 4) ? program.verbose : 2;
var wine = (typeof program.wine === 'undefined') ? false : true;
var outputCharset = (typeof program.outputCharset !== 'undefined' && charsets_1.output.includes(program.outputCharset.toUpperCase())) ? program.outputCharset.toUpperCase() : '';
var priority = (program.priority >= 0 && program.priority <= 5) ? program.priority : 2;
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
    'priority': priority,
    'safePPO': safePPO,
    'strict': strict,
    'verbose': verbose,
    'wine': wine
};
if (program.preExecute) {
    options['preExecute'] = program.preExecute;
}
if (program.postExecute) {
    options['postExecute'] = program.postExecute;
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var stdin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!program.args.length) return [3 /*break*/, 1];
                program.args.forEach(function (scriptFile) {
                    commands_1.compile(scriptFile, options);
                });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getStdin()];
            case 2:
                stdin = _a.sent();
                if (stdin) {
                    options['preExecute'] = stdin;
                    commands_1.compile('', options);
                }
                else {
                    program.help();
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); })();
