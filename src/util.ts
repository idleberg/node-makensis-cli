import * as makensis from 'makensis';

interface CompilerOptions {
  inputCharset?: string;
  json?: boolean;
  nocd?: boolean;
  noconfig?: boolean;
  pause?: boolean;
  ppo?: boolean;
  safeppo?: boolean;
  strict?: boolean;
  verbose?: number;
  wine?: boolean;
}


const compile = (filePath: string, options: CompilerOptions = null) => {
  options || (options = {});

  makensis.compile(filePath, options)
  .then(output => {
    if (options.json === true) {
      jsonString(output);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.json === true) {
      jsonString(output);
    } else {
      console.error(`Exit Code ${output.status}\n${output.stderr}`);
    }
  });
};

const hdrinfo = (options: CompilerOptions = null) => {
  options || (options = {});

  makensis.hdrInfo()
  .then(output => {
    // due to an error in makensis, this code should never run
    if (options.json === true) {
      jsonFlags(output.stdout);
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.json === true) {
      jsonFlags(output.stdout);
    } else {
      console.log(output.stdout);
    }
  });
};

const version = (options: CompilerOptions = null) => {
  options || (options = {});

  makensis.version(options)
  .then(output => {
    if (options.json === true) {
      jsonString(output.stdout, 'version');
    } else {
      console.log(output.stdout);
    }
  }).catch(output => {
    if (options.json === true) {
      jsonString(output.stderr, 'error');
    } else {
      console.error(output.stderr);
    }
  });
};

const cmdhelp = (title: string = '', options: CompilerOptions = null) => {
  options || (options = {});

  makensis.cmdHelp(title, options)
  .then(output => {
    // due to an error in makensis, this code should never run
    return;
  }).catch(output => {
    if (options.json === true) {
      jsonString(output.stderr, 'help');
    } else {
      console.error(output.stderr);
    }
  });
};

const jsonString = (input: string, key = null) => {
  let obj = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }
  if (key === null) {
    obj = input;
  } else {
    obj[key] = input;
  }

  let json = JSON.stringify(obj, null, '  ');

  console.log(json);
};

const jsonFlags = (input: string) => {
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

  let table: any = [];
  let tableSizes: any = [];
  let tableSymbols: any = [];

  // Split sizes
  filteredLines.forEach((line) => {
    let pair = line.split(' is ');
    pair[0] = pair[0].replace('Size of ', '');
    pair[0] = pair[0].replace(' ', '_');
    pair[1] = pair[1].substring(-1, pair[1].length - 1);

    let obj = {};
    obj[pair[0]] = pair[1];
    tableSizes.push(pair);
  });

  let objSizes = {};
  objSizes['sizes'] = tableSizes;
  table.push(objSizes);

  // Split symbols
  symbols.forEach((symbol) => {
    let pair: Array<any> = symbol.split('=');
    let obj = {};

    if (pair.length > 1) {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      obj[pair[0]] = pair[1];
    } else {
      obj[symbol] = true;
    }

    tableSymbols.push(obj);
  });

  let obj = {};
  obj['defined_symbols'] = tableSymbols;
  table.push(obj);

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

  const json = JSON.stringify(table, null, '  ');
  console.log(json);
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
