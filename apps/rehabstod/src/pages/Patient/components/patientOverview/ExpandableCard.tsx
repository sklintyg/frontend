import { IDSButton } from '@frontend/ids-react-ts'
import { ReactNode, useState } from 'react'

export function ExpandableCard({
  description,
  subTitle,
  children,
  expanded,
  onExpand,
}: {
  description: string
  subTitle: string
  children: ReactNode
  expanded?: boolean
  onExpand?: () => void
}) {
  const [localExpanded, setLocalExpanded] = useState(false)

  const handleOnClick = () => {
    if (onExpand) {
      onExpand()
    } else {
      setLocalExpanded(true)
    }
  }

  if (expanded ? !expanded : !localExpanded) {
    return (
      <>
        <p className="py-5">{description}</p>
        <IDSButton sblock onClick={handleOnClick} className="flex justify-center">
          Visa
        </IDSButton>
      </>
    )
  }

  return (
    <>
      <h5 className="ids-heading-4 pt-5">{subTitle}</h5>
      {children}
    </>
  )
}
