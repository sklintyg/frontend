import type { ReactNode } from 'react'
import { CaregiverIcon } from '../../../images/CaregiverIcon'

export function PPSubHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-10 py-3 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] text-[#00706E]">
      <div className="ic-container flex gap-5 place-items-center">
        <CaregiverIcon className="h-10 w-10" />
        <h1 className="text-2xl">{children}</h1>
      </div>
    </div>
  )
}
