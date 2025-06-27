import { useState } from 'react'
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

  onClick?: (currentExpanded: boolean) => void
}

export const ExpandableList = ({ items, nbrOfVisibleItems, onClick }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const handleOnClick = () => {
    if (onClick) {
      onClick(!expanded)
    }

    setExpanded(!expanded)
  }

  return (
    <>
      {items.map((item, index) => {
        if (index > nbrOfVisibleItems - 1) {
          return expanded ? item : null
        }

        return item
      })}
      {items.length > nbrOfVisibleItems && (
        <LinkWrapper>
          <LinkButton onClick={handleOnClick} className="ic-link iu-pt-200">
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
