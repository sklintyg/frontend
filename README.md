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

```
.
├── apps ─ End products
│   ├── rehabstod
│   └── webcert
├── e2e ─ Integration tests for all applications
└── packages ─ Shared between applications and libraries
    ├── components
    ├── eslint-config-custom ─ Linting configuration
    ├── eslint-config-react ─ Linting configuration for react applications
    ├── utils ─ Utility functions
    └── schemas ─ Typescript definitions and schemas
```

## Configure Editor

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

## Running tests

vitest is used for executing tests.

To run tests in all packages `yarn test`

To run tests in a perticular workspace `yarn workspace <name of workspace> test`

## Writing tests

Smoke test that checks if the component can be rendered without crashing. Ex:

```javascript
it('renders without crashing', () => {
  const question = fakeTextElement({ id: 'id' })
  expect(render(<UvText question={question['id']} />)).not.toThrow()
})
```

Tests that verifies the components behavior from a user perspective. Use React Testing Library.

```javascript
it('displaying empty value', () => {
  const question = fakeTextElement({ id: 'id' })
  const { getByText } = render(<UvText question={question['id']} />)
  getByText(/Ej angivet/i)
})
```

## Build pipelines

Read about build pipelines using [openshift](./openshift/README.md)

## Resources

- [ESlint](https://eslint.org/)
- [Turbo Repo](https://turbo.build/repo)
