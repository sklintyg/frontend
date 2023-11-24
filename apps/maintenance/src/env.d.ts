/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGIN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
