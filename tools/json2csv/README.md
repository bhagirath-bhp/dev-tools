# json2csv (legacy alias)

This path is kept for backward compatibility.

The canonical tool is now `csv-json`, which supports both directions:

- `json2csv`
- `csv2json`

Use:

```bash
node ../csv-json/src/index.js --mode json2csv input.json > output.csv
node ../csv-json/src/index.js --mode csv2json input.csv > output.json
```
