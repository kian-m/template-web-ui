# Agent Instructions for `frontend/`

This directory contains a Next.js frontend project using TypeScript and Prettier.
Follow these guidelines when modifying files under `frontend/`.

## Required commands

- **Install dependencies**: Dependencies are installed in the startup script with `npm run install --legacy-peer-deps`. You generally do not need to run `npm ci` unless `package.json` or `package-lock.json` change.
- **Run formatting**: `npm run format` after making changes. This project uses Prettier; formatting is mandatory before committing.
- **Run build**: `npm run build` to ensure the application compiles.

## Recommended steps

- **Run tests**: `npm test` before committing to catch regressions.
- **Always run tests for new code**: ensure any new changes pass the test suite before committing.
- **Use Node.js version**: follow the version specified in the repo root `.nvmrc` (currently `24`).
- **Local development**: `npm run dev` starts the development server.

## Environment & best practices

- Do not commit `node_modules`, `.next`, or other ignored build artifacts. See `.gitignore` for the full list.
- Keep environment variables in `.env` files (not committed).
- When adding scripts or environment variables, document them in `README.md`.
- Add tests for new features where possible.
- Use the `@` alias for absolute imports instead of relative `../` paths.
