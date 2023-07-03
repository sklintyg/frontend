import { IDSCard } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { hasNoChildren } from '../../../../../utils/hasNoChildren'
import { ExpandableCard } from '../ExpandableCard'

export function PatientOverviewCard({
  title,
  subTitle,
  description,
  children,
  expanded,
  onExpand,
}: {
  title: string
  subTitle: string
  description: string
  children: ReactNode
  expanded?: boolean
  onExpand?: () => void
}) {
  return (
    <div className="bg-secondary-95 rounded">
      <IDSCard fill>
        <h3 className="ids-heading-4">{title}</h3>
        <hr />
        {hasNoChildren(children) ? (
          <p className="py-5">Det finns för tillfället ingen information i denna kategori att inhämta.</p>
        ) : (
          <ExpandableCard description={description} subTitle={subTitle} expanded={expanded} onExpand={onExpand}>
            {children}
          </ExpandableCard>
        )}
      </IDSCard>
    </div>
  )
}
