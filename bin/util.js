"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var makensis = require("makensis");
var compile = function (filePath, options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    makensis.compile(filePath, options)
        .then(function (output) {
        if (options.json === true) {
            jsonString(output);
        }
        else {
            console.log(output.stdout);
        }
    }).catch(function (output) {
        if (options.json === true) {
            jsonString(output);
        }
        else {
            console.error("Exit Code " + output.status + "\n" + output.stderr);
        }
    });
};
exports.compile = compile;
var hdrinfo = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    makensis.hdrInfo()
        .then(function (output) {
        // due to an error in makensis, this code should never run
        if (options.json === true) {
            jsonFlags(output.stdout);
        }
        else {
            console.log(output.stdout);
        }
    }).catch(function (output) {
        if (options.json === true) {
            jsonFlags(output.stdout);
        }
        else {
            console.log(output.stdout);
        }
    });
};
exports.hdrinfo = hdrinfo;
var version = function (options) {
    if (options === void 0) { options = null; }
    options || (options = {});
    makensis.version(options)
        .then(function (output) {
        if (options.json === true) {
            jsonString(output.stdout, 'version');
        }
        else {
            console.log(output.stdout);
        }
    }).catch(function (output) {
        if (options.json === true) {
            jsonString(output.stderr, 'error');
        }
        else {
            console.error(output.stderr);
        }
    });
};
exports.version = version;
var cmdhelp = function (title, options) {
    if (title === void 0) { title = ''; }
    if (options === void 0) { options = null; }
    options || (options = {});
    makensis.cmdHelp(title, options)
        .then(function (output) {
        // due to an error in makensis, this code should never run
        return;
    }).catch(function (output) {
        if (options.json === true) {
            jsonString(output.stderr, 'help');
        }
        else {
            console.error(output.stderr);
        }
    });
};
exports.cmdhelp = cmdhelp;
var jsonString = function (input, key) {
    if (key === void 0) { key = null; }
    var obj = {};
    if (key === 'version' && input.startsWith('v')) {
        input = input.substr(1);
    }
    if (key === null) {
        obj = input;
    }
    else {
        obj[key] = input;
    }
    var json = JSON.stringify(obj, null, '  ');
    console.log(json);
};
var jsonFlags = function (input) {
    var lines = input.split('\n');
    var filteredLines = lines.filter(function (line) {
        if (line !== '') {
            return line;
        }
    });
    var lastLine = filteredLines.pop();
    // console.log(lines);
    // console.log(lastLine);
    var prefix = 'Defined symbols: ';
    var lineData = lastLine.substring(prefix.length);
    var symbols = lineData.split(',');
    // console.log(symbols);
    var table = [];
    var tableSizes = [];
    var tableSymbols = [];
    // Split sizes
    filteredLines.forEach(function (line) {
        var pair = line.split(' is ');
        pair[0] = pair[0].replace('Size of ', '');
        pair[0] = pair[0].replace(' ', '_');
        pair[1] = pair[1].substring(-1, pair[1].length - 1);
        var obj = {};
        obj[pair[0]] = pair[1];
        tableSizes.push(pair);
    });
    var objSizes = {};
    objSizes['sizes'] = tableSizes;
    table.push(objSizes);
    // Split symbols
    symbols.forEach(function (symbol) {
        var pair = symbol.split('=');
        var obj = {};
        if (pair.length > 1) {
            if (isInteger(pair[1]) === true) {
                pair[1] = parseInt(pair[1], 10);
            }
            obj[pair[0]] = pair[1];
        }
        else {
            obj[symbol] = true;
        }
        tableSymbols.push(obj);
    });
    var obj = {};
    obj['defined_symbols'] = tableSymbols;
    table.push(obj);
    var config = {
        columns: {
            0: {
                alignment: 'center',
                minWidth: 10
            },
            1: {
                alignment: 'center',
                minWidth: 10
            }
        }
    };
    var json = JSON.stringify(table, null, '  ');
    console.log(json);
};
var isInteger = function (x) {
    return x % 2 === 0;
};
