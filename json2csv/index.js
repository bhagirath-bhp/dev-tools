// Legacy entrypoint kept for backward compatibility.
const { runCli } = require('../tools/json2csv/src/index.js');

if (require.main === module) {
  runCli();
}
