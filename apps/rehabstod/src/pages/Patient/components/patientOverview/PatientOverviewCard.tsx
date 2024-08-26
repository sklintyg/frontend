import { IDSCard } from '@frontend/ids-react-ts'
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
    <div className="bg-secondary-95">
      <IDSCard fill>
        <h5 className="ids-heading-4">{title}</h5>
        <hr />
        {!isEmpty ? (
          <ExpandableCard description={description} subTitle={subTitle} expanded={expanded} onExpand={onExpand}>
            {children}
          </ExpandableCard>
        ) : (
          <EmptyInformation />
        )}
      </IDSCard>
    </div>
  )
}
