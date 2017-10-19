import * as makensis from 'makensis';
const YAML = require('yamljs');

const compile = (filePath, options = null) => {
  options || (options = {});

  makensis.compile(filePath, options)
  .then(output => {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printString(output, options.target);
    } else if (options.yaml === true) {
      printString(output, options.target);
    } else {
      console.error(`Exit Code ${output.status}\n${output.stderr}`);
    }
  });
};

const hdrinfo = (options = null) => {
  options || (options = {});

  makensis.hdrInfo()
  .then(output => {
    // due to an error in makensis, this code should never run
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printFlags(output.stdout, options.target);
    } else {
      console.log(output.stdout);
    }
  });
};

const version = (options = null) => {
  options || (options = {});

  makensis.version(options)
  .then(output => {
    if (options.target !== null) {
      printString(output.stdout, options.target, 'version');
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'error');
    } else {
      console.error(output.stderr);
    }
  });
};

const cmdhelp = (title = '', options = null) => {
  options || (options = {});

  makensis.cmdHelp(title, options)
  .then(output => {
    // due to an error in makensis, this code should never run
    return;
  }).catch(output => {
    if (options.target !== null) {
      printString(output.stderr, options.target, 'help');
    } else {
      console.error(output.stderr);
    }
  });
};

const printString = (input, target = 'json', key = null) => {
  let obj = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }
  if (key === null) {
    obj = input;
  } else {
    obj[key] = input;
  }

  let output;
  if (target === 'yaml') {
    output = YAML.stringify(obj);
  } else {
    output = JSON.stringify(obj, null, '  ');
  }

  console.log(output);
};

const printFlags = (input, target = 'json') => {
  let lines = input.split('\n');

  let filteredLines = lines.filter((line) => {
    if (line !== '') {
      return line;
    }
  });

  let lastLine = filteredLines.pop();
  // console.log(lines);
  // console.log(lastLine);

  const prefix = 'Defined symbols: ';

  let lineData = lastLine.substring(prefix.length);
  let symbols = lineData.split(',');
  // console.log(symbols);

  let table = {};
  let tableSizes = {};
  let tableSymbols = {};

  // Split sizes
  filteredLines.forEach((line) => {
    let pair = line.split(' is ');
    pair[0] = pair[0].replace('Size of ', '');
    pair[0] = pair[0].replace(' ', '_');
    pair[1] = pair[1].substring(-1, pair[1].length - 1);

    let obj = {};
    tableSizes[pair[0]] = pair[1];
    // tableSizes.push(pair);
  });

  let objSizes = {};
  table['sizes'] = tableSizes;
  // table.push(objSizes);

  // Split symbols
  symbols.forEach((symbol) => {
    let pair = symbol.split('=');
    let obj = {};

    if (pair.length > 1) {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  let obj = {};
  table['defined_symbols'] = tableSymbols;
  // table.push(obj);

  const config = {
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

  let output;
  if (target === 'yaml') {
    output = YAML.stringify(table);
  } else {
    output = JSON.stringify(table, null, '  ');
  }

  console.log(output);
};

const isInteger = (x) => {
  return x % 2 === 0;
};

export {
  cmdhelp,
  compile,
  hdrinfo,
  version
};
