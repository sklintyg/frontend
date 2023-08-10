import { IDSIconChevron } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function PatientAccordion({ title, children, open = true }: { title: string; children: ReactNode; open: boolean }) {
  return (
    <details open={open} className="group [&:not(:last-child)]:mb-5">
      <summary role="button" className="border-neutral-40 mb-2.5 flex cursor-pointer items-center space-x-2 border-b py-5">
        <h3 className="ids-heading-4 text-accent-40 m-0 grow">{title}</h3>
        <span className="inline-block h-5 w-5 origin-center rotate-90 justify-self-end group-open:-rotate-90">
          <IDSIconChevron width="100%" height="100%" className="h-full w-full" />
        </span>
      </summary>
      {children}
    </details>
  )
}
