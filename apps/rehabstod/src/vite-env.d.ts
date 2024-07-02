/// <reference types="vite/client" />
import type { AriaAttributes, DOMAttributes } from 'react'

// Add properties used by ids-code
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    trigger?: string
  }
}
