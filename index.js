#!/usr/bin/env node

const join = require('path').join;

/*  The TypeScript compiler does not support she-bangs,
 *  so we need this stupid workaround 🙄
 */
require(join(__dirname, 'bin/mn.js'));
require(join(__dirname, 'bin/update-notifier.js'));
