import { IDSIconChevron } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

export function Accordion({ children, title, open = false }: { children: ReactNode; title: string; open?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const [internalOpen, setInternalOpen] = useState(open)

  return (
    <details
      ref={ref}
      onToggle={() => setInternalOpen(Boolean(ref.current?.hasAttribute('open')))}
      open={internalOpen}
      className="[&:not(:last-child)]:mb-5"
    >
      <summary role="button" className="mb-1.5 flex cursor-pointer items-center space-x-2 ">
        <span className="m-0 text-accent-40 underline">{title}</span>
        <span className="inline-block h-3 w-3 origin-center justify-self-end">
          <IDSIconChevron width="100%" rotate={internalOpen ? '270' : '90'} height="100%" className="h-full w-full" />
        </span>
      </summary>
      {internalOpen && children}
    </details>
  )
}
