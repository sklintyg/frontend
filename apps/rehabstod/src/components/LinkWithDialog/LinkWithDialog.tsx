import { IDSDialog, IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function LinkWithDialog({ title, children }: { title: string; children: ReactNode }) {
  return (
    <IDSDialog dismissible headline={title}>
      <button trigger="" className="text-accent-40 flex items-center gap-2" type="button">
        <IDSIcon name="arrow" size="xs" />
        {title}
      </button>
      {children}
    </IDSDialog>
  )
}
