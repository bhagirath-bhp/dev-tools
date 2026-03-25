# json2csv

Convert locale-based JSON translation objects into CSV.

## Usage

```bash
node src/index.js input.json > output.csv
```

You can also pipe JSON through stdin:

```bash
cat input.json | node src/index.js > output.csv
```

## Expected JSON Shape

The tool accepts either:

1. An object with top-level `Language` key containing locales, or
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
