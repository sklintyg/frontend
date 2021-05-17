# `Frontend`

## Prerequisite
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install).
- Install [lerna](https://github.com/lerna/lerna): `yarn global add lerna` 

## Setup

- Clone the repo. `git clone https://github.com/sklintyg/frontend.git`
- Setup the workspace. `lerna bootstrap`
- Open the folder in Intellij. 
    - Install [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier/) plugin.
    - Configure to use prettier when formatting in IntelliJ (requires IntelliJ 2020.2). See Settings -> Language & Frameworks -> Javascript -> Prettier
- Now IntelliJ is setup for coding.

## Develop on Webcert

Run the app in the development mode. React will hot-reload changes made in the app as well as in common.

- Start webcert in development: `yarn workspace @frontend/webcert start`

Run the mockserver (will be used until integrated with Webcert appserver). It currently supports retrieving, validating, saving and signing.

- Start mockserver in development: `yarn workspace @frontend/mockserver dev`

To open a certificate use `http://localhost:<port>/certificate/<intygsid>` ex: `http://localhost:3000/certificate/bed26d3e-7112-4f08-98bf-01be40e26c80`. The mockserver will automatically create a certificate with passed id.

## Running Webcert locally on Docker

Pre-requisites: Setup the development environment (Follow instructions in 'develop' on https://github.com/sklintyg/devops)

1. Start the development environment (Follow instructions in 'develop' on https://github.com/sklintyg/devops)
    * docker-compose up -d (start as daemon)
    * docker-compose up (will lock console and use it to print container logs)
2. Start Webcert
    * gradlew appRun
3. Start Webcert-frontend (This time using docker-compose.yaml in the frontend repo)
    * docker-compose up -d (start as daemon)
    * docker-compose up (will lock console and use it to print container logs)
4. Navigate to Webcert-frontend in a chromium-browser: https://wc2.localtest.me/welcome

When doing step #3, docker will automatically build an image if it doesn't exist. If you already have an image and want to build a new one follow these steps:

1. Take down the Webcert-frontend
    * docker-compose down
2. Rebuild Webcert-frontend
    * docker-compose build
3. Start Webcert-frontend
    * docker-compose up -d (start as daemon)
    * docker-compose up (will lock console and use it to print container logs)
4. Navigate to Webcert-frontend in a chromium-browser: https://wc2.localtest.me/welcome

## Deploy Webcert on OpenShift (devtest)

This is a temporary way to deploy Webcert on OpenShift, until the deployment pipeline is ready.

Pre-requisites: Need to have "make" installed. For Windows you can use the following instructions: https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows

1. Open your terminal of choice and log in to OpenShift.
2. Run `make`
3. Done! 

A Deployment has been created in tintyg for devtest. It will automatically deploy on image-changes. When running the make command, a new runtime image with Webcert-frontend will built and automatically deployed. 

## Running storybook

Storybook can be used to develop and test components within the common package. Storybook will hot-reload changes in common. 

- Start storybook: `yarn workspace @frontend/common storybook`

## Running tests

Jest is used for executing tests. 

To run tests in Webcert:  `yarn workspace @frontend/webcert test`

To run tests in Common:  `yarn workspace @frontend/common test` (add `--watchAll` if you want the test runner to run the tests for any change you make.)

See [Jest CLI Options](https://jestjs.io/docs/en/cli) for more info what you can do when executing tests.

## Writing tests

Below are recommended type of tests for a component. We are looking into [jest-axe](https://www.npmjs.com/package/jest-axe) for accessibility testing.

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
Test with snapshot to verify that changes in the component was intentional.
```javascript
it('Verify snapshot', () => {
  const question = createQuestionWithTextValue()
  const tree = renderer.create(<UvText question={question} />).toJSON()
  expect(tree).toMatchSnapshot()
})
```

