import ArrowToggle from '@frontend/common/src/components/utils/ArrowToggle'
import React, { Fragment, useState } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button<{ disabled: boolean }>`
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

interface Props {
  rowContent: string[]
  id: string
  handleClick: (event: React.MouseEvent) => void
  disabled?: boolean
}

const ExpandableTableRow: React.FC<Props> = ({ rowContent, id, handleClick, children, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Fragment key={id}>
      <tr>
        {rowContent.map((cell, idx) => {
          if (idx === 0) {
            return (
              <td key={idx}>
                <ArrowToggle onClick={handleToggle} className="iu-mr-200" isUp={isExpanded} />
                <StyledButton
                  className={`ic-link iu-text-left ${disabled && 'iu-color-muted'}`}
                  type="button"
                  id={id}
                  onClick={handleClick}
                  disabled={!!disabled}>
                  {cell}
                </StyledButton>
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
