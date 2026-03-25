# Repository Conventions

## Tool Layout

Every tool should follow this shape:

```text
tools/<tool-name>/
  src/
  tests/
  examples/
  README.md
```

## Naming

- Use lowercase kebab-case for tool folder names.
- Keep tool names behavior-focused (`json2csv`, `http-retry`, `git-branch-clean`).

## Design Guidelines

- Tools should do one thing well.
- Prefer deterministic output for same input.
- Fail with clear error messages and non-zero exit codes.
- Keep dependencies minimal.
