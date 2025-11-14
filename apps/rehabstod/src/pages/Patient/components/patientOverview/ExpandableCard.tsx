import { Button, Heading } from '@frontend/components'
import type { ReactNode } from 'react'
import { useState } from 'react'

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
        <Button sBlock onClick={handleOnClick} className="flex justify-center">
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
