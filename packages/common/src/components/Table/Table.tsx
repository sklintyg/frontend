import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

interface Props {
  caption?: string
  children: React.ReactNode
  headings: TableHeading[]
  onTableHeadClick: (event: React.MouseEvent<HTMLTableHeaderCellElement>) => void
  orderBy: string
  ascending: boolean
}

export interface TableHeading {
  id: string
  title: string
}

const Caption = styled.caption`
  border-top: 0px !important;
`

const Table: React.FC<Props> = ({ orderBy, ascending, caption, children, headings, onTableHeadClick }) => {
  const getSortingArrow = (id: string) => {
    if (id === orderBy) {
      return ascending ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />
    }
  }

  const getTableHeadings = () => {
    return headings.map((heading) => (
      <th scope="col" id={heading.id} onClick={onTableHeadClick}>
        {getSortingArrow(heading.id)}
        {heading.title}
      </th>
    ))
  }

  return (
    <>
      <table className="ic-table ic-table--full">
        <thead>{getTableHeadings()}</thead>
        {caption && <Caption>{caption}</Caption>}
        <tbody>{children}</tbody>
      </table>
    </>
  )
}

export default Table
