# `Frontend`

![End-To-End](https://github.com/sklintyg/frontend/actions/workflows/e2e.yml/badge.svg)
![Frontend CI](https://github.com/sklintyg/frontend/actions/workflows/frontend.yml/badge.svg)

## Setup

- Install [Node v18](https://nodejs.org/en/download/releases/)
  - Alternatively via [nvm](https://github.com/nvm-sh/nvm)
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install).

1. Install dependencies with `yarn install`
2. Execute a build with `yarn build`
3. Start development environment and watchers with `yarn start`
4. Run tests with `yarn test`

## Applications

This repo holds multiple applications, read more about getting started with each application in their respective README.

- [rehabstod](apps/rehabstod/README.md)
- [webcert](packages/webcert/README.md)

## Repository structure

This is the invisioned structure for the future.

```text
.
├── apps ─ End products
│   ├── rehabstod
│   └── webcert
├── e2e ─ Integration tests for all applications
└── packages ─ Shared between applications and libraries
    ├── eslint-config-custom ─ Linting configuration
    ├── eslint-config-react ─ Linting configuration for react applications
    └── ...
```

### Shared libraries

The `/packages` folder contain documented libraries that is utilized between applications/libraries.
We utilize [Turbo Repo](https://turbo.build/repo) to manage build's for each package and application. This makes it possible to have multiple watchers running with `yarn start`, or build everything that needs to be bundled with `yarn build`.

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

To run tests in all packages `yarn test`

To run tests in a perticular workspace `yarn workspace <name of workspace> test`

### Writing tests

Smoke test that checks if the component can be rendered without crashing. Ex:

```typescript
it('renders without crashing', () => {
  const question = fakeTextElement({ id: 'id' })
  expect(render(<UvText question={question['id']} />)).not.toThrow()
})
```

Tests that verifies the components behavior from a user perspective. Use React Testing Library.

```typescript
it('displaying empty value', () => {
  const question = fakeTextElement({ id: 'id' })
  const { getByText } = render(<UvText question={question['id']} />)
  getByText(/Ej angivet/i)
})
```

## Integration tests

Read about [integration tests](./e2e/README.md).

## Build pipelines

Read about build pipelines using [openshift](./openshift/README.md).

## Resources

- [ESlint](https://eslint.org/)
- [Turbo Repo](https://turbo.build/repo)
