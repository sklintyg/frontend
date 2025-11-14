import type { ReactNode } from 'react'
import { AttentionIcon } from '../../../images'

export function StatusBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-auto gap-5 p-4 border border-[#01A5A3] border-dashed bg-[#E6F1F1] mb-5 rounded-[10px]">
      <div className="w-5 h-5 shrink-0">
        <AttentionIcon className="w-full h-full" />
      </div>
      <div>{children}</div>
    </div>
  )
}
