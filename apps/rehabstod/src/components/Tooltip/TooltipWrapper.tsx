import { ReactNode } from 'react'

export function TooltipWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none z-50 max-w-xs whitespace-normal rounded border border-neutral-40 bg-white px-5 py-3 text-base font-normal text-neutral-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] md:max-w-sm">
      {children}
    </div>
  )
}
