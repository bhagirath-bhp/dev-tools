const fs = require('fs');

function jsonToCsv(obj) {
  const langObj = obj.Language || obj;
  const locales = Object.keys(langObj).sort();
  const allKeys = new Set();

  locales.forEach((loc) => {
    const entries = langObj[loc] || {};
    Object.keys(entries).forEach((key) => allKeys.add(key));
  });

  const columns = Array.from(allKeys).sort();
  const header = ['locale', ...columns];

  const escapeCell = (value) => {
    if (value == null) {
      return '';
    }

    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
  };

  const rows = [header.map(escapeCell).join(',')];

  locales.forEach((loc) => {
    const row = [loc];
    const entries = langObj[loc] || {};
    columns.forEach((col) => {
      row.push(entries[col] == null ? '' : entries[col]);
    });
    rows.push(row.map(escapeCell).join(','));
  });

  return rows.join('\n');
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (char === '\r') {
      if (nextChar === '\n') {
        i += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (inQuotes) {
    throw new Error('Invalid CSV: unmatched quote found.');
  }

  // Preserve trailing rows if the last line has content.
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

function csvToJson(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    throw new Error('CSV input is empty.');
  }

  const header = rows[0];
  if (header.length < 2) {
    throw new Error('CSV must contain at least a locale column and one key column.');
  }

  const columns = header.slice(1);
  const language = {};

  rows.slice(1).forEach((row) => {
    if (!row[0]) {
      return;
    }

    const locale = row[0];
    const entries = {};

    columns.forEach((key, index) => {
      entries[key] = row[index + 1] == null ? '' : row[index + 1];
    });

    language[locale] = entries;
  });

  return { Language: language };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function parseCliArgs(argv) {
  const parsed = {
    mode: 'json2csv',
    inputPath: null,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (arg === '--mode' || arg === '-m') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --mode. Use json2csv or csv2json.');
      }
      parsed.mode = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (parsed.inputPath) {
      throw new Error('Only one input path is supported.');
    }

    parsed.inputPath = arg;
  }

  if (!['json2csv', 'csv2json'].includes(parsed.mode)) {
    throw new Error('Invalid mode. Use json2csv or csv2json.');
  }

  return parsed;
}

function printHelp() {
  console.log('Usage: node src/index.js --mode <json2csv|csv2json> [input-file]');
  console.log('');
  console.log('Modes:');
  console.log('  json2csv   Convert JSON input to CSV output (default).');
  console.log('  csv2json   Convert CSV input to JSON output.');
  console.log('');
  console.log('If no input file is provided, stdin is used.');
}

async function runCli() {
  try {
    const { mode, inputPath, help } = parseCliArgs(process.argv.slice(2));

    if (help) {
      printHelp();
      return;
    }

    const raw = inputPath ? fs.readFileSync(inputPath, 'utf8') : await readStdin();

    if (mode === 'csv2json') {
      const converted = csvToJson(raw);
      console.log(JSON.stringify(converted, null, 2));
      return;
    }

    const parsed = JSON.parse(raw);
    const converted = jsonToCsv(parsed);
    console.log(converted);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  csvToJson,
  jsonToCsv,
  parseCsv,
  runCli,
};
