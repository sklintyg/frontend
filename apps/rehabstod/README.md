# `@frontend/rehabstod`

Rehabstod application

## Configure frontend for local backend

Create a `.env.development.local` in the same folder as `.env.development`. This file will hold our configuration overrides and will be ignored by git. Add the following or change settings to fit your need:

```
VITE_API_TARGET=http://localhost:8020
VITE_HTTPS=false
VITE_WS_PROTOCOL='wss'
```

- `VITE_API_TARGET` tells the application that our backend is on localhost:8020.
- `VITE_HTTPS` make sure that we don't use ssl, when used behind a reverse proxy.
- `VITE_WS_PROTOCOL` make sure that websocket communication uses ssl when behind reverse proxy.

Start the application with `yarn workspace @frontend/rehabstod dev` for only webcert or `yarn start` for all watchers. Navigate to Webcert-frontend in a chromium-browser: https://rs2.rs.localtest.me/welcome
