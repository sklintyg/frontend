# `@frontend/webcert`

Webcert application.

## Run Webcert backend and frontend client

Detailed instructions for building and running the backend apps can be found in https://github.com/sklintyg/devops and https://github.com/sklintyg/common.

### Pre-requisites

- Install Java OpenJDK 11
  - Goto https://jdk.java.net/archive/ and download zip
  - Unpack to folder of your choice
  - Add path to `bin` folder to the `Path` environment variable
- In order to be able to build the backend apps you need to add the following environment variable
  `JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8`
- Setup the development environment (Follow instructions in `develop/` on https://github.com/sklintyg/devops)
- Make sure you have the VPN client Cisco AnyConnect installed

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
   - Start webcert in development: `yarn start`
6. Navigate to Webcert-frontend in a chromium-browser: https://wc2.wc.localtest.me/welcome
