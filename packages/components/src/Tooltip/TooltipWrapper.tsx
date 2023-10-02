import { ReactNode } from 'react'

export function TooltipWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="border-neutral-40 text-neutral-20 pointer-events-none z-50 max-w-xs whitespace-normal rounded border bg-white py-3 px-5 text-base font-normal shadow-[0_0_10px_rgba(0,0,0,0.3)] md:max-w-sm">
      {children}
    </div>
  )
}
