#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var commands_1 = require("./commands");
// Action
program
    .usage('[command] [options]')
    .option('-j, --json', 'prints output as JSON')
    .option('-w, --wine', 'use Wine to run makensis')
    .parse(process.argv);
var options = {
    'json': (typeof program.json === 'undefined') ? false : true,
    'wine': (typeof program.wine === 'undefined') ? false : true
};
if (program.args.length) {
    commands_1.cmdhelp(program.args[0], options);
}
else {
    commands_1.cmdhelp('', options);
}
