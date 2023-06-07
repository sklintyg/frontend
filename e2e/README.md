# `@frontend/e2e`

Integration tests

## How to run locally

Install dependencies

```bash
pnpm install
```

Build applications and dependencies

```bash
pnpm build
```

Start applications with devtest environment

```bash
pnpm start:test
```

Run desired cypress configuration

```bash
pnpm --filter @frontend/e2e webcert --config baseUrl=https://127.0.0.1:3000
```

OR

```bash
pnpm --filter @frontend/e2e rehabstod --config baseUrl=https://127.0.0.1:3030
```
