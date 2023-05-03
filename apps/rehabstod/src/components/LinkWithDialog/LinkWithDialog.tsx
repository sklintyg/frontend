import { IDSDialog, IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function LinkWithDialog({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <IDSIcon name="arrow" size="xs" />
        <button trigger="" className="text-accent-40" type="button">
          {title}
        </button>
      </div>
      <IDSDialog dismissible headline={title}>
        {children}
      </IDSDialog>
    </>
  )
}
