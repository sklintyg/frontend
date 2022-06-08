import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import arrow from '../../images/arrow-down.svg'

const ArrowDown = styled.img`
  cursor: pointer;
  width: 0.9em;
  display: inline-block;
`

const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
`

interface Props {
  rowContent: string[]
  id: string
  handleClick: (event: React.MouseEvent) => void
}

const ExpandableTableRow: React.FC<Props> = ({ rowContent, id, handleClick, children }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Fragment key={id}>
      <tr>
        {rowContent.map((cell, idx) => {
          if (idx === 0) {
            return (
              <td key={idx}>
                {isExpanded ? (
                  <ArrowUp src={arrow} alt="" onClick={toggleExpand} className="iu-mr-300" data-testid="expandArrow" />
                ) : (
                  <ArrowDown src={arrow} alt="" onClick={toggleExpand} className="iu-mr-300" data-testid="expandArrow" />
                )}
                <button className="ic-link iu-text-left" type="button" id={id} onClick={handleClick}>
                  {cell}
                </button>
              </td>
            )
          }

          return <td key={idx}>{cell}</td>
        })}
      </tr>
      {isExpanded ? children : null}
    </Fragment>
  )
}

export default ExpandableTableRow
