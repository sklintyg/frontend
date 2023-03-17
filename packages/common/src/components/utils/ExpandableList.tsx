import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'
import { LinkButton } from '../../styles'

const LinkWrapper = styled.div`
  min-width: 100px;
  margin-left: 10px;
  display: flex;
  justify-content: space-around;
`

interface Props {
  items: React.ReactNode[]
  nbrOfVisibleItems: number
}

export const ExpandableList: React.FC<Props> = ({ items, nbrOfVisibleItems }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {items.map((item, index) => {
        if (index > nbrOfVisibleItems - 1) {
          return <>{expanded && item}</>
        }

        return item
      })}
      {items.length > nbrOfVisibleItems && (
        <LinkWrapper>
          <LinkButton onClick={() => setExpanded(!expanded)} className="ic-link">
            {expanded ? 'Se färre' : 'Se fler'}
            {expanded ? (
              <>
                <ChevronUpIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
              </>
            ) : (
              <ChevronDownIcon size="sm" className="iu-ml-200" style={{ height: 'auto' }} />
            )}
          </LinkButton>
        </LinkWrapper>
      )}
    </>
  )
}
