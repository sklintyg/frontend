# `@frontend/webcert`

[Webcert](https://www.inera.se/tjanster/alla-tjanster-a-o/intygstjanster/webcert/) application.

## Getting started

By default webcert will communicate with a shared and deployed test backend. This will work in most cases but there are instances where a local backend installation is needed.

`yarn workspace @frontend/webcert dev`

## Run Webcert backend and frontend client

Detailed instructions for building and running the backend apps can be found in <https://github.com/sklintyg/devops> and <https://github.com/sklintyg/common>.

### Pre-requisites

- Install Java OpenJDK 11
  - Goto <https://jdk.java.net/archive/> and download zip
  - Unpack to folder of your choice
  - Add path to `bin` folder to the `Path` environment variable
- In order to be able to build the backend apps you need to add the following environment variable
  `JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8`
- Setup the development environment (Follow instructions in `develop/` on <https://github.com/sklintyg/devops>)
- Make sure you have the VPN client Cisco AnyConnect installed

1. Build backend apps by opening a terminal i repo and running command `gradlew build install -x test` (or `./gradlew build install -x test` in Git Bash) in the follwing order
   - Refdata
   - Infra
   - Common
2. Build Webcert with command `gradlew build -x test` (or `./gradlew build -x test` in Git Bash)
3. Start the development environment (Follow instructions in `develop/` on <https://github.com/sklintyg/devops>)
   - Open terminal in `sklintyg/devops/develop/docker-compose/`
   - Run command `docker-compose up -d` (start as daemon)
   - alt. run command `docker-compose up` (will lock console and use it to print container logs)
4. Start Webcert
   - Open terminal in `sklintyg/webcert/`
   - Run command `gradlew appRun` (or `./gradlew appRun` in Git Bash)

### Configure frontend

Create a `.env.development.local` in the same folder as `.env.development`. This file will hold our configuration overrides and will be ignored by git. Add the following or change settings to fit your need:

```bash
VITE_API_TARGET=http://localhost:8020
VITE_HTTPS=false
VITE_WS_PROTOCOL=wss
```

- `VITE_API_TARGET` tells the application that our backend is on localhost:8020.
- `VITE_HTTPS` make sure that we don't use ssl.
- `VITE_WS_PROTOCOL` make sure that websocket communication uses ssl.

Start the application with `yarn workspace @frontend/webcert dev` for only webcert or `yarn start` for all watchers. Navigate to Webcert-frontend in a chromium-browser: <https://wc2.wc.localtest.me/welcome>

## Resources

- [React](https://react.dev/) ─ Components
- [Inera CSS](https://css.inera.se/) ─ Inera styling
- [Styled Components](https://styled-components.com/) ─ Inera styling
- [React Router v5](https://v5.reactrouter.com/) ─ Application routing
- [Redux](https://redux.js.org/) ─ State management and data fetching
- [Redux Toolkit](https://redux-toolkit.js.org/) ─ Utility functions for redux
- [Vite](https://vitejs.dev/) ─ Application bundling
- [Vitest](https://vitest.dev/) ─ Unit testing framework
- [Testing Library](https://testing-library.com/) ─ Unit testing library
