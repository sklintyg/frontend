import type { ReactNode } from 'react'

export function PPFieldset({ children }: { children: ReactNode }) {
  return <div className="border border-[#CCC] shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] rounded p-5 flex flex-col gap-5 mb-5">{children}</div>
}
