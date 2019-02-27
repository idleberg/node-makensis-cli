"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makensis = require("makensis");
var yeoman = require("yeoman-environment");
// Exports
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
exports.cmdhelp = cmdhelp;
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
exports.compile = compile;
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
exports.hdrinfo = hdrinfo;
var license = function (options) {
    if (options === void 0) { options = {}; }
    Object.assign(options, {});
    makensis.license(options)
        .then(function (output) {
        log(output.stdout, options);
    }).catch(function (output) {
        logError(output.stderr, options);
    });
};
exports.license = license;
var nsisdir = function (options) {
    if (options === void 0) { options = {}; }
    makensis.nsisDir(options)
        .then(function (output) {
        log(output, options);
    }).catch(function (output) {
        // fallback for NSIS < 3.03
        logError(output, options);
    });
};
exports.nsisdir = nsisdir;
var scaffold = function () {
    var env = yeoman.createEnv();
    env.register(require.resolve('generator-nsis'), 'nsis:app');
    env.run('nsis:app');
};
exports.scaffold = scaffold;
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
exports.version = version;
// Helpers
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
