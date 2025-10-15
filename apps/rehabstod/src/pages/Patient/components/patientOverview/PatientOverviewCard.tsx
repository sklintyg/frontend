import { Divider, Heading } from '@frontend/components'
import { IDSCard } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { EmptyInformation } from './EmptyInformation'
import { ExpandableCard } from './ExpandableCard'

export function PatientOverviewCard({
  title,
  subTitle,
  description,
  isEmpty,
  children,
  expanded,
  onExpand,
}: {
  title: string
  subTitle: string
  description: string
  isEmpty: boolean
  children: ReactNode
  expanded?: boolean
  onExpand?: () => void
}) {
  return (
    <IDSCard>
      <Heading level={5} size="xs">
        {title}
      </Heading>
      <Divider />
      {!isEmpty ? (
        <ExpandableCard description={description} subTitle={subTitle} expanded={expanded} onExpand={onExpand}>
          {children}
        </ExpandableCard>
      ) : (
        <EmptyInformation />
      )}
    </IDSCard>
  )
}
