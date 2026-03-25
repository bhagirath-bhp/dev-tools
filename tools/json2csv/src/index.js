// Legacy alias: keep old path working.
const csvJsonTool = require('../../csv-json/src/index.js');

if (require.main === module) {
  csvJsonTool.runCli();
}

module.exports = csvJsonTool;
