import { ReactNode, useState } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'

export function ExpandableCard({ description, subTitle, children }: { description: string; subTitle: string; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)

  if (!expanded) {
    return (
      <>
        <p className="py-5">{description}</p>
        <IDSButton onClick={() => setExpanded(true)} className="flex justify-center">
          Visa
        </IDSButton>
      </>
    )
  }

  return (
    <>
      <h4 className="ids-heading-4 pt-5">{subTitle}</h4>
      {children}
    </>
  )
}
