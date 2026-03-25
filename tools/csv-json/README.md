# csv-json

Bidirectional converter for locale-based translation data between JSON and CSV.

## Usage

```bash
node src/index.js --mode json2csv input.json > output.csv
node src/index.js --mode csv2json input.csv > output.json
```

You can also use stdin:

```bash
cat input.json | node src/index.js --mode json2csv > output.csv
cat input.csv | node src/index.js --mode csv2json > output.json
```

Default mode is `json2csv` when `--mode` is not provided.

## JSON Shape

The JSON input/output supports either:

1. A top-level `Language` object containing locale maps, or
2. A direct locale map.

Example:

```json
{
  "Language": {
    "en": { "hello": "Hello" },
    "fr": { "hello": "Bonjour" }
  }
}
```

## CSV Shape

The first column must be the locale identifier. Remaining columns are translation keys.

Example:

```csv
locale,hello
en,Hello
fr,Bonjour
```
