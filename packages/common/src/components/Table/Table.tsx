import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { TableHeading } from '../../types/list'
import { Spinner } from '../index'

interface Props {
  caption?: string
  children: React.ReactNode
  headings: TableHeading[]
  onTableHeadClick: (event: React.MouseEvent<HTMLTableHeaderCellElement>) => void
  orderBy: string
  ascending: boolean
  isLoadingContent: boolean
  isEmptyList: boolean
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

const Table: React.FC<Props> = ({ orderBy, ascending, caption, isLoadingContent, isEmptyList, children, headings, onTableHeadClick }) => {
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
      <th key={heading.id} scope="col" id={heading.id} onClick={onTableHeadClick} data-html data-tip={heading.description}>
        {getSortingArrow(heading.id, heading.title)}
        {heading.title}
      </th>
    ))
  }

  const getHighlighted = () => {
    return 1 + headings.findIndex((heading) => orderBy === heading.id)
  }

  return (
    <>
      <StyledTable className="ic-table ic-table--full" highlighted={getHighlighted()}>
        <thead>
          <tr>{getTableHeadings()}</tr>
        </thead>
        {caption && <Caption>{caption}</Caption>}
        <tbody>{!isLoadingContent && !isEmptyList && <>{children}</>}</tbody>
      </StyledTable>
      {isLoadingContent && (
        <tr>
          <td className="iu-border-white">
            <Spinner className={'iu-mt-300'} />
          </td>
        </tr>
      )}
      {!isLoadingContent && isEmptyList && (
        <tr>
          <td className="iu-border-white">
            <p className="iu-pt-200">Inga resultat att visa.</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default Table
