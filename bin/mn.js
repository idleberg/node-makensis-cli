#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pkg = require("../package.json");
var program = require("commander");
var updateNotifier = require("update-notifier");
// Action
updateNotifier({ pkg: pkg }).notify();
program
    .version(require('../package.json').version)
    .usage('[sub-command] [script] [options]')
    .description('CLI version of node-makensis')
    .command('hdrinfo', 'Print compilation flags').alias('flags')
    .command('compile <script>', 'Compiles script(s)', { isDefault: true })
    .command('version [options]', 'Import repository')
    .command('cmdhelp [command] [options]', 'Prints out help for single or all commands').alias('help')
    .command('license [options]', 'Prints license')
    .command('nsisdir', 'Prints NSIS installation folder').alias('dir')
    .command('scaffold', 'Creates custom made NSIS script').alias('new')
    .parse(process.argv);
