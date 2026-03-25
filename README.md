# dev-tools

A collection of small development tools built from real engineering challenges.

## Repository Structure

```
dev-tools/
	tools/
		<tool-name>/
			src/                # Tool implementation
			tests/              # Unit/integration tests for this tool
			examples/           # Sample inputs/outputs and usage fixtures
			README.md           # Tool-specific docs and usage
			package.json        # Optional: if this tool has Node dependencies
	templates/
		tool/
			README.md           # Starter README when creating a new tool
	docs/
		conventions.md        # Shared repo conventions
	json2csv/
		index.js              # Backward-compatible wrapper (legacy path)
```

## Conventions

- Every tool lives under `tools/<tool-name>`.
- Keep each tool self-contained with its own docs, tests, and examples.
- Prefer small CLIs with clear input/output behavior.
- Use the `templates/tool` starter when adding a new utility.

## Current Tools

- `json2csv`: Convert locale-based JSON objects into CSV.

## Add A New Tool

1. Copy `templates/tool` to `tools/<your-tool-name>`.
2. Implement logic in `src/`.
3. Add tests under `tests/` and sample data under `examples/`.
4. Document usage and edge cases in the tool `README.md`.