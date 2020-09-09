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

## Running storybook

Storybook can be used to develop and test components within the common package. Storybook will hot-reload changes in common. 

- Start storybook: `yarn workspace @frontend/common storybook`

## Running tests

Jest is used for executing tests. 

To run tests in Webcert:  `yarn workspace @frontend/webcert test`

To run tests in Common:  `yarn workspace @frontend/common test` (add `--watchAll` if you want the test runner to run the tests for any change you make.)

See [Jest CLI Options](https://jestjs.io/docs/en/cli) for more info what you can do when executing tests.

## Writing tests

Below are recommended type of tests for a component and examples. We are looking into [jest-axe](https://www.npmjs.com/package/jest-axe) for accessibility testing.

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

