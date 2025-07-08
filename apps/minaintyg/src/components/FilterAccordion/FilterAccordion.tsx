import { IDSIconChevron } from '@inera/ids-react'
import type { ReactNode } from 'react'

export function FilterAccordion({ total, listed, noun, children }: { noun: string; total: number; listed: number; children: ReactNode }) {
  return (
    <details className="group mb-5">
      <summary className="flex cursor-pointer select-none flex-col md:flex-row">
        <div className="grow border-y border-neutral-90  py-2.5 md:pl-5">
          Visar {listed} av {total} {noun}
        </div>
        <div className="-mt-px flex justify-between gap-5 border-y border-neutral-90  py-2.5 md:mt-0 md:border-l md:px-5">
          Filtrera lista
          <IDSIconChevron width="100%" height="100%" className="h-2.5 w-2.5 rotate-90 self-center group-open:-rotate-90" />
        </div>
      </summary>
      <div className="border-b border-neutral-90  py-5">{children}</div>
    </details>
  )
}
