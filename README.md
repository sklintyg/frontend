[![E2E Tests](https://github.com/sklintyg/frontend/actions/workflows/playwright.yml/badge.svg)](https://github.com/sklintyg/frontend/actions/workflows/playwright.yml)

# `Frontend`

## Setup

- Install [Node v18](https://nodejs.org/en/download/releases/)
  - Alternatively via [nvm](https://github.com/nvm-sh/nvm)
- Install [pnpm](https://pnpm.io/installation).

1. Install dependencies with `pnpm install`
2. Execute a build with `pnpm build`
3. Start development environment and watchers with `pnpm start`
4. Run tests with `pnpm test`

## Applications

This repo holds multiple applications, read more about getting started with each application in their respective README.

- [minaintyg](apps/minaintyg/README.md)
- [rehabstod](apps/rehabstod/README.md)
- [webcert](apps/webcert/README.md)
- [maintenance](apps/maintenance/README.md)

## Repository structure

This is the invisioned structure for the future.

```text
.
├── apps ─ End products
│   ├── rehabstod
│   └── webcert
└── packages ─ Shared between applications and libraries
    ├── eslint-config-custom ─ Linting configuration
    ├── eslint-config-react ─ Linting configuration for react applications
    └── ...
```

### Shared libraries

The `/packages` folder contain documented libraries that is utilized between applications/libraries.

Shared libraries should generally:

1. Output ECMAScript modules that applications and other libraries can consume.
2. Contain a `README.md`, outlining it's functionality.
3. Be added to root tsconfig.json's `paths`, for symbol navigation.

Exceptions can be made, for example eslint packages only outputs commonjs since eslint still uses that. And `combine-coverage` only holds a binary that the root application uses to combine application test-reports.

## Configure Editors

### IntelliJ

- Install [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier/) plugin.
- Configure to use prettier when formatting in IntelliJ (requires IntelliJ 2020.2). See Settings -> Language & Frameworks -> Javascript -> Prettier
- Make sure ESLint is enabled and enable "Run eslint --fix on save".

### VS Code

- Install plugin `ESLint`
- Install plugin `vscode-styled-components`
- Install plugin `Prettier - Code formatter`
- Enable auto format on save

  - Press `ctrl` + `shift` + `p`, type `settings` and open `Preferences: Open Settings (JSON)`
  - Add the following properties

    ```json
    {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true
    }
    ```

  - Add the following properties (_optional_)

    ```json
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
      "source.fixAll": true
    }
    ```

_Plugin recommendations can be found by opening the extension panel `ctrl` + `x` and type `@recommended`_

## Unit tests

vitest is used for executing tests.

To run tests in all packages `pnpm test`

To run tests in all packages with ui `pnpm test:ui`

To run any perticular test `pnpm test /{apps, packages}/<name of application/something.test.ts`

To run tests in a perticular package `pnpm --filter <package_name> test`

Read more about [filtering](https://pnpm.io/filtering)

### Writing tests

- [Avoid testing implementation details](https://kentcdodds.com/blog/testing-implementation-details).
- [Write fewer, longer tests](https://kentcdodds.com/blog/write-fewer-longer-tests)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Build pipelines

Read about build pipelines using [openshift](./openshift/README.md).

## Resources

- [ESlint](https://eslint.org/)
- [pnpm](https://pnpm.io/)
