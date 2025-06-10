import { IDSAccordion } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Heading } from '../../../../components/Heading/Heading'

export function PatientAccordion({ title, children, open = true }: { title: string; children: ReactNode; open: boolean }) {
  const [internalOpen, setInternalOpen] = useState(open)

  return (
    <IDSAccordion
      headline={
        <Heading level={4} size="xs">
          {title}
        </Heading>
      }
      headlineSize="xs"
      onCollapsed={() => setInternalOpen(false)}
      onExpanded={() => setInternalOpen(true)}
    >
      {internalOpen && children}
    </IDSAccordion>
  )
}
