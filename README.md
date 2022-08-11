# `Frontend`

## Pre-requisites

- Install Java OpenJDK 11
  - Goto https://jdk.java.net/archive/ and download zip
  - Unpack to folder of your choice
  - Add path to `bin` folder to the `Path` environment variable
- In order to be able to build the backend apps you need to add the following environment variable
  `JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8`
- Setup the development environment (Follow instructions in `develop/` on https://github.com/sklintyg/devops)
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install).
- Install [Node v14](https://nodejs.org/en/download/releases/) (via [nvm](https://github.com/nvm-sh/nvm) as a suggestion)
  - Node v14 is needed as it's the version that supports `node-sass` v4, using a newer version will generate error relating to missing python package when running `npm install`

## Setup

- Clone the repo. `git clone https://github.com/sklintyg/frontend.git`
- Open terminal in `sklintyg/frontend/` and install packages with `yarn install`
- Configure preferred IDE
  - IntelliJ
    - Install [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier/) plugin.
    - Configure to use prettier when formatting in IntelliJ (requires IntelliJ 2020.2). See Settings -> Language & Frameworks -> Javascript -> Prettier
  - VS Code
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

## Run Webcert backend and frontend client

Detailed instructions for building and running the backend apps can be found in https://github.com/sklintyg/devops and https://github.com/sklintyg/common.

1. Build backend apps by opening a terminal i repo and running command `gradlew build install -x test` (or `./gradlew build install -x test` in Git Bash) in the follwing order
   - Refdata
   - Infra
   - Common
2. Build Webcert with command `gradlew build -x test` (or `./gradlew build -x test` in Git Bash)
3. Start the development environment (Follow instructions in `develop/` on https://github.com/sklintyg/devops)
   - Open terminal in `sklintyg/devops/develop/docker-compose/`
   - Run command `docker-compose up -d` (start as daemon)
   - alt. run command `docker-compose up` (will lock console and use it to print container logs)
4. Start Webcert
   - Open terminal in `sklintyg/webcert/`
   - Run command `gradlew appRun` (or `./gradlew appRun` in Git Bash)
5. Run the app in the development mode. React will hot-reload changes made in the app as well as in common.
   - Start webcert in development: `yarn workspace @frontend/webcert start`
6. Navigate to Webcert-frontend in a chromium-browser: https://wc2.wc.localtest.me/welcome

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

## Running storybook

Storybook can be used to develop and test components within the common package. Storybook will hot-reload changes in common.

- Start storybook: `yarn workspace @frontend/common storybook`

## Running tests

Jest is used for executing tests.

To run tests in Webcert: `yarn workspace @frontend/webcert test`

To run tests in Common: `yarn workspace @frontend/common test` (add `--watchAll` if you want the test runner to run the tests for any change you make.)

See [Jest CLI Options](https://jestjs.io/docs/en/cli) for more info what you can do when executing tests.

## Writing tests

Below are recommended types of tests for a component. We are looking into [jest-axe](https://www.npmjs.com/package/jest-axe) for accessibility testing.

Smoke test that checks if the component can be rendered without crashing. Ex:

```javascript
it('renders without crashing', () => {
  const question = createQuestionWithTextValue()
  const div = document.createElement('div')
  ReactDOM.render(<UvText question={question} />, div)
})
```

Tests that verifies the components behavior from a user perspective. Use React Testing Library.

```javascript
it('displaying empty value', () => {
  const question = createQuestion({ type: CertificateDataValueType.TEXT })
  const { getByText } = render(<UvText question={question} />)
  getByText(/Ej angivet/i)
})
```
