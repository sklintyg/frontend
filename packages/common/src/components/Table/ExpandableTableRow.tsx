import ArrowToggle from '@frontend/common/src/components/utils/ArrowToggle'
import React, { Fragment, useState } from 'react'

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
                <button
                  className={`ic-link iu-text-left iu-border-white ${disabled && 'ic-button--disabled'}`}
                  type="button"
                  id={id}
                  onClick={handleClick}
                  disabled={disabled}>
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
