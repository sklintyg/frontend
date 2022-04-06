import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { TableHeading } from '../../types/list'

interface Props {
  caption?: string
  children: React.ReactNode
  headings: TableHeading[]
  onTableHeadClick: (event: React.MouseEvent<HTMLTableHeaderCellElement>) => void
  orderBy: string
  ascending: boolean
}

const Caption = styled.caption`
  border-top: 0px !important;
`

interface TableProps {
  highlighted: number
}

const StyledTable = styled.table<TableProps>`
  td:nth-child(${(props) => props.highlighted}) {
    background-color: ${(props) => (props.highlighted > 0 ? 'rgba(1, 165, 163, 0.08)' : '')} !important;
  }
`

const SortingButton = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  color: #5f5f5f;
  float: right;
`

const Table: React.FC<Props> = ({ orderBy, ascending, caption, children, headings, onTableHeadClick }) => {
  const getSortingArrow = (id: string, title: string) => {
    if (!title) {
      return null
    }
    if (id === orderBy) {
      return ascending ? (
        <SortingButton>
          <FontAwesomeIcon icon={faAngleUp} className={'iu-color-main'} />
        </SortingButton>
      ) : (
        <SortingButton>
          <FontAwesomeIcon icon={faAngleDown} className={'iu-color-main'} />
        </SortingButton>
      )
    } else {
      return (
        <SortingButton>
          <FontAwesomeIcon icon={faAngleUp} />
          <FontAwesomeIcon icon={faAngleDown} />
        </SortingButton>
      )
    }
  }

  const getTableHeadings = () => {
    return headings.map((heading) => (
      <th scope="col" id={heading.id} onClick={onTableHeadClick}>
        {getSortingArrow(heading.id, heading.title)}
        {heading.title}
      </th>
    ))
  }

  const getHighlighted = () => {
    return 1 + headings.findIndex((heading) => orderBy === heading.id)
  }

  return (
    <StyledTable className="ic-table ic-table--full" highlighted={getHighlighted()}>
      {getTableHeadings()}
      {caption && <Caption>{caption}</Caption>}
      <tbody>{children}</tbody>
      {!children && <p>Inga resultat att visa.</p>}
    </StyledTable>
  )
}

export default Table
