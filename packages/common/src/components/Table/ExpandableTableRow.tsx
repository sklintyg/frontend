import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment, useState } from 'react'
import styled from 'styled-components'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
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
          if (rowContent.indexOf(cell) === 0) {
            return (
              <td key={idx}>
                <StyledArrow icon={isExpanded ? faAngleUp : faAngleDown} className="iu-color-cta-dark iu-mr-300" onClick={toggleExpand} />
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
