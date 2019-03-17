#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var commands_1 = require("./commands");
// Action
program
    .parse(process.argv);
commands_1.scaffold();
