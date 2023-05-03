import { IDSCard } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { ExpandableCard } from './ExpandableCard'
import { EmptyInformation } from './EmptyInformation'

export function PatientOverviewCard({
  title,
  subTitle,
  description,
  isEmpty,
  children,
}: {
  title: string
  subTitle: string
  description: string
  isEmpty: boolean
  children: ReactNode
}) {
  return (
    <IDSCard fill>
      <h4 className="ids-heading-4">{title}</h4>
      <hr />
      {!isEmpty ? (
        <ExpandableCard description={description} subTitle={subTitle}>
          {children}
        </ExpandableCard>
      ) : (
        <EmptyInformation />
      )}
    </IDSCard>
  )
}
