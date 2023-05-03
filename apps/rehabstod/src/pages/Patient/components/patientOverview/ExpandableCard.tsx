import { ReactNode, useState } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'

export function ExpandableCard({
  description,
  subTitle,
  children,
  open,
  onOpen,
}: {
  description: string
  subTitle: string
  children: ReactNode
  open?: boolean
  onOpen?: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const handleOnClick = () => {
    if (onOpen) {
      onOpen()
    } else {
      setExpanded(true)
    }
  }

  if (open ? !open : !expanded) {
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
