import { IDSAccordion } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Heading } from '../../../../components/Heading/Heading'

export function PatientAccordion({ title, children, open = true }: { title: string; children: ReactNode; open: boolean }) {
  const [internalOpen, setInternalOpen] = useState(open)

  return (
    <div className="[&:not(:last-child)]:mb-5">
      <IDSAccordion
        expanded={open}
        headline={
          <Heading level={4} size="xs" className="mb-0">
            {title}
          </Heading>
        }
        headlineSize="xs"
        onCollapsed={() => setInternalOpen(false)}
        onExpanded={() => setInternalOpen(true)}
      >
        {internalOpen && children}
      </IDSAccordion>
    </div>
  )
}
