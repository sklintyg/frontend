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

