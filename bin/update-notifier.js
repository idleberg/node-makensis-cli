"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var updateNotifier = require("update-notifier");
var pkg = require("../package.json");
updateNotifier({ pkg: pkg }).notify();
