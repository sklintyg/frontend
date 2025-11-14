import type { ReactNode } from 'react'
import { CaregiverIcon } from '../../../images/CaregiverIcon'

export function SubHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-10 py-3 flex gap-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] place-items-center text-[#00706E] text-2xl font-bold">
      <CaregiverIcon className="h-10 w-10" />
      {children}
    </div>
  )
}
