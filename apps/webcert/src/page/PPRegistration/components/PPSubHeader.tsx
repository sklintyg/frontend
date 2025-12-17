import type { ReactNode } from 'react'
import { CaregiverIcon } from '../../../images/CaregiverIcon'
import { EditIcon } from '../../../images/EditIcon'

export function PPSubHeader({ children, type = 'create' }: { children: ReactNode; type?: 'create' | 'edit' }) {
  return (
    <div className="py-3 shadow-[0_2px_6px_0_rgba(0,0,0,0.15)] text-[#00706E]">
      <div className="ic-container flex gap-5 place-items-center">
        {type === 'create' && <CaregiverIcon className="h-10 w-10" />}
        {type === 'edit' && <EditIcon className="h-[30px] w-[30px]" />}
        <div>
          <h1 className="text-[24px]">{children}</h1>
          {type === 'edit' && (
            <p className="text-[#5f5f5f]">Här kan du se och administrera dina registrerade uppgifter för dig och din verksamhet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
