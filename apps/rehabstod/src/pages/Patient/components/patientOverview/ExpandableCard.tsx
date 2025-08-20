import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button } from '../../../../components/Button/Button'
import { Heading } from '../../../../components/Heading/Heading'

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
        <p className="mb-5">{description}</p>
        <Button sblock onClick={handleOnClick} className="flex justify-center">
          Visa
        </Button>
      </>
    )
  }

  return (
    <>
      <Heading level={6} size="xs">
        {subTitle}
      </Heading>
      {children}
    </>
  )
}
