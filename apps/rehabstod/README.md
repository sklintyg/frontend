# `@frontend/rehabstod`

[Rehabstöd](https://www.inera.se/tjanster/alla-tjanster-a-o/intygstjanster/rehabstod/) application.

## Application structure

```text
src
.
├── components ─ Shared components
├── hooks ─ General purpos hooks
├── pages
│   ├── SomePage
│   │   ├── components ─ Page specific components
│   │   ├── hooks ─ Page speicific hooks
│   │   └── utils ─ Page speicific utils
│   └── SomePage.tsx ─ Page
├── store ─ Redux store
└── utils ─ Shared utils
```

Top layer holds components and functions shared by every page. Parts that are shared between applications should be in `packages` in the [monorepo](/README.md#repository-structure). Parts that are unique for a page should be put in that page's subfolder, when unsure just add to the page and refactoring can be done later.

## Local backend

Default configuration will communicate with a deployed and shared test API that works in most cases but in some scenarious it's required to have a local backend.

Read more about setting up the backends

- [devops](https://github.com/sklintyg/devops)
- [common](https://github.com/sklintyg/common)
- [rehabstod](https://github.com/sklintyg/rehabstod)
- [intygstjanst](https://github.com/sklintyg/intygstjanst)

### Configure frontend

Create a `.env.development.local` in the same folder as `.env.development`. This file will hold our configuration overrides and will be ignored by git. Add the following or change settings to fit your need:

```bash
VITE_API_TARGET=http://localhost:8030
VITE_HTTPS=false
VITE_WS_PROTOCOL=wss
```

- `VITE_API_TARGET` tells the application that our backend is on localhost:8020.
- `VITE_HTTPS` make sure that we don't use ssl, when used behind a reverse proxy.
- `VITE_WS_PROTOCOL` make sure that websocket communication uses ssl when behind reverse proxy.

Start the application with `pnpm --filter @frontend/rehabstod dev` for only webcert or `pnpm start` for all watchers. Navigate to Webcert-frontend in a chromium-browser: <https://rs2.rs.localtest.me/welcome>

Read more about environment files over at [Vite](https://vitejs.dev/guide/env-and-mode.html#env-files).

## Resources

- [React](https://react.dev/) ─ Components
- [Inera Design System](https://design.inera.se/) ─ Inera components and styling
- [TailwindCSS](https://tailwindcss.com/) ─ Styling with utility classes
- [React Router v6](https://reactrouter.com/en/main) ─ Application routing
- [Redux Toolkit](https://redux-toolkit.js.org/) ─ State management and data fetching
- [Vite](https://vitejs.dev/) ─ Application bundling
- [MSW](https://mswjs.io/) ─ API mocks
- [zod](https://zod.dev/) ─ Schema definitions and mocking
- [Vitest](https://vitest.dev/) ─ Unit testing framework
- [Testing Library](https://testing-library.com/) ─ Unit testing library
