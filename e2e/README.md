# `@frontend/e2e`

Integration tests

## How to run locally

Install dependencies

```
$ yarn install
```

Build applications and dependencies

```
$ yarn build
```

Start applications with devtest environment

```
$ yarn start:test
```

Run desired cypress configuration

```
$ yarn workspace @frontend/e2e webcert --config baseUrl=https://127.0.0.1:3000

OR

$ yarn workspace @frontend/e2e rehabstod --config baseUrl=https://127.0.0.1:3030
```
