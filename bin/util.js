'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.hdrinfo = exports.compile = exports.cmdhelp = undefined;

var _makensis = require('makensis');

var makensis = _interopRequireWildcard(_makensis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var YAML = require('yamljs');

var compile = function compile(filePath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.compile(filePath, options).then(function (output) {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.error('Exit Code ' + output.status + '\n' + output.stderr);
    }
  });
};

var hdrinfo = function hdrinfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.hdrInfo().then(function (output) {
    // due to an error in makensis, this code should never run
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  });
};

var version = function version() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  options || (options = {});

  makensis.version(options).then(function (output) {
    if (options.target !== null) {
      printString(output.stdout, options.target, 'version');
    } else {
      console.log(output.stdout);
    }
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'error');
    } else {
      console.error(output.stderr);
    }
  });
};

var cmdhelp = function cmdhelp() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  options || (options = {});

  makensis.cmdHelp(title, options).then(function (output) {
    // due to an error in makensis, this code should never run
    return;
  }).catch(function (output) {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'help');
    } else {
      console.error(output.stderr);
    }
  });
};

var printString = function printString(input) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var obj = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }
  if (key === null) {
    obj = input;
  } else {
    obj[key] = input;
  }

  var output = void 0;
  if (target === 'yaml') {
    output = YAML.stringify(obj);
  } else {
    output = JSON.stringify(obj, null, '  ');
  }

  console.log(output);
};

var printFlags = function printFlags(input) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';

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

  var table = {};
  var tableSizes = {};
  var tableSymbols = {};

  // Split sizes
  filteredLines.forEach(function (line) {
    var pair = line.split(' is ');
    pair[0] = pair[0].replace('Size of ', '');
    pair[0] = pair[0].replace(' ', '_');
    pair[1] = pair[1].substring(-1, pair[1].length - 1);

    var obj = {};
    tableSizes[pair[0]] = pair[1];
    // tableSizes.push(pair);
  });

  var objSizes = {};
  table['sizes'] = tableSizes;
  // table.push(objSizes);

  // Split symbols
  symbols.forEach(function (symbol) {
    var pair = symbol.split('=');
    var obj = {};

    if (pair.length > 1) {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  var obj = {};
  table['defined_symbols'] = tableSymbols;
  // table.push(obj);

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

  var output = void 0;
  if (target === 'yaml') {
    output = YAML.stringify(table);
  } else {
    output = JSON.stringify(table, null, '  ');
  }

  console.log(output);
};

var isInteger = function isInteger(x) {
  return x % 2 === 0;
};

exports.cmdhelp = cmdhelp;
exports.compile = compile;
exports.hdrinfo = hdrinfo;
exports.version = version;