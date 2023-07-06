import { ReactNode, createContext, useRef } from 'react'

export const StickyContext = createContext<HTMLElement | null>(null)

export function StickyContainerProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <StickyContext.Provider value={ref.current}>
      <div ref={ref} className="sticky top-0 z-30 flex flex-col" />
      {children}
    </StickyContext.Provider>
  )
}
