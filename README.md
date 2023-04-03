# `Frontend`

![End-To-End](https://github.com/sklintyg/frontend/actions/workflows/e2e.yml/badge.svg)
![Frontend CI](https://github.com/sklintyg/frontend/actions/workflows/frontend.yml/badge.svg)

## Setup

- Install [Yarn](https://classic.yarnpkg.com/en/docs/install).
- Install [Node v18](https://nodejs.org/en/download/releases/)
  - Alternatively via [nvm](https://github.com/nvm-sh/nvm)

1. Install dependencies with `yarn install`
2. Execute a build with `yarn build`
3. Start development environment and watchers with `yarn start`
4. Run tests with `yarn test`

## Applications

This repo holds multiple applications, read more about getting started with each application in their respective README.

- [webcert](packages/webcert/README.md)
- [rehabstod](packages/rehabstod/README.md)

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

## Resources

- [ESlint](https://eslint.org/)
- [Turbo Repo](https://turbo.build/repo)

## OpenShift Build Pipeline

Webcert-frontend is built using a OpenShift build pipeline. The OpenShift-template for creating the pipeline can be found in `openshift/pipelinetemplate-build-frontend.yaml`.

The pipeline is partially prepared for building other frontend applications within the frontend-repo.

**Parameters:**

| Parameter             | Required | Description                                                           |
| --------------------- | -------- | --------------------------------------------------------------------- |
| APP_NAME              | Yes      | The Web App name, ex: `webcert-frontend`                              |
| RELEASE_VERSION       | Yes      | The name of this release, ex: `2021-2`                                |
| STAGE                 |          | The stage label, default is `test`                                    |
| ARTIFACT_IMAGE_SUFFIX |          | The suffix of the artifact ImageStream, default is `artifact`         |
| GIT_URL               | Yes      | URL to git repository, ex: `https://github.com/sklintyg/frontend.git` |
| GIT_CI_BRANCH         | Yes      | Branch in git repository, ex: `master`                                |

To create a frontend-pipeline using the template, you make sure to first login to OpenShift and then run the following command.

```
`oc process -f pipelinetemplate-build-frontend.yaml -p APP_NAME=webcert-frontend -p RELEASE_VERSION=2021-2 -p GIT_URL=https://github.com/sklintyg/frontend.git -p GIT_CI_BRANCH=master | oc apply  -f -`
```

## Running tests

vitest is used for executing tests.

To run tests in all packages `yarn test`

To run tests in a perticular workspace `yarn workspace <name of workspace> test`

## Writing tests

Below are recommended types of tests for a component. We are looking into [jest-axe](https://www.npmjs.com/package/jest-axe) for accessibility testing.

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
