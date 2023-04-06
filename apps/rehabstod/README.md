# `@frontend/rehabstod`

## Self signed certificate

For running development mode with valid ssl, install [mkcert](https://github.com/FiloSottile/mkcert) and run `mkcert -install`. Click "yes" when prompted.

Create a certificate for `rs2.rs.localtest.me` with:

```bash
yarn workspace @frontend/rehabstod mkcert
```

## Run client with mocked service worker

Useful for quickly getting mocked backend response data.

Update `.env.development.local` with

```bash
VITE_USE_MOCKS=true
VITE_HTTPS=true
VITE_WS_PROTOCOL=wss
```
