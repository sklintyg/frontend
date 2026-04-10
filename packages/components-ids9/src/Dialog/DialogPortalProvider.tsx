import type { ReactNode } from 'react'
import { createContext, useRef } from 'react'

export const DialogPortalContext = createContext<HTMLElement | null>(null)

export function DialogPortalProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <DialogPortalContext.Provider value={ref.current}>
      {children}
      <div ref={ref} />
    </DialogPortalContext.Provider>
  )
}
