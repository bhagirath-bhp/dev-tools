const fs = require('fs');

function jsonToCsv(obj) {
  const langObj = obj.Language || obj;
  const locales = Object.keys(langObj).sort();
  const allKeys = new Set();

  locales.forEach((loc) => {
    const entries = langObj[loc] || {};
    Object.keys(entries).forEach((k) => allKeys.add(k));
  });

  const columns = Array.from(allKeys).sort();
  const header = ['locale', ...columns];

  const esc = (value) => {
    if (value == null) {
      return '';
    }

    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
  };

  const rows = [header.map(esc).join(',')];

  locales.forEach((loc) => {
    const row = [loc];
    const entries = langObj[loc] || {};
    columns.forEach((col) => row.push(entries[col] == null ? '' : entries[col]));
    rows.push(row.map(esc).join(','));
  });

  return rows.join('\n');
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

async function runCli() {
  const inputPath = process.argv[2];

  try {
    const raw = inputPath ? fs.readFileSync(inputPath, 'utf8') : await readStdin();
    const parsed = JSON.parse(raw);
    const csv = jsonToCsv(parsed);
    console.log(csv);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  jsonToCsv,
  runCli,
};
