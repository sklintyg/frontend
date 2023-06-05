import { ReactNode, useState } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'

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
        <IDSButton onClick={handleOnClick} className="flex justify-center">
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
