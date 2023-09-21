import { IDSIconChevron } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function FilterAccordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group mb-5">
      <summary className="flex cursor-pointer select-none flex-col md:flex-row">
        <div className="border-stone-clear grow border-y py-2.5 md:pl-5">{title}</div>
        <div className="border-stone-clear -mt-px flex justify-between gap-5 border-y py-2.5 md:mt-0 md:border-l md:px-5">
          Filtrera lista
          <IDSIconChevron width="100%" height="100%" className="h-2.5 w-2.5 rotate-90 self-center group-open:-rotate-90" />
        </div>
      </summary>
      <div className="border-stone-clear border-b py-5">{children}</div>
    </details>
  )
}
