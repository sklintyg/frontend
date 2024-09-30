import { IDSIconChevron } from 'ids-react-ts'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

export function PatientAccordion({ title, children, open = true }: { title: string; children: ReactNode; open: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const [internalOpen, setInternalOpen] = useState(open)

  return (
    <details
      ref={ref}
      onToggle={() => setInternalOpen(Boolean(ref.current?.hasAttribute('open')))}
      open={open}
      className="group [&:not(:last-child)]:mb-5"
    >
      <summary role="button" className="mb-2.5 flex cursor-pointer items-center space-x-2 border-b border-neutral-40 py-5">
        <h4 className="ids-heading-4 m-0 grow text-accent-40">{title}</h4>
        <span className="inline-block h-5 w-5 origin-center rotate-90 justify-self-end group-open:-rotate-90">
          <IDSIconChevron width="100%" height="100%" className="h-full w-full" />
        </span>
      </summary>
      {internalOpen && children}
    </details>
  )
}
