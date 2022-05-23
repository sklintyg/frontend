import React, { useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { TableHeading } from '../../types/list'
import { Spinner } from '../index'
import ReactTooltip from 'react-tooltip'

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
    background-color: rgba(1, 165, 163, 0.08) !important;
  }

  th {
    cursor: pointer;
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
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const getSortingArrow = (id: string, title: string) => {
    if (!title) {
      return null
    }
    if (id === orderBy) {
      return ascending ? (
        <SortingButton aria-label="Byt till att sortera fallande">
          <FontAwesomeIcon icon={faAngleUp} className={'iu-color-main'} aria-label="Kolumnen sorteras stigande" />
        </SortingButton>
      ) : (
        <SortingButton aria-label="Byt till att sortera stigande">
          <FontAwesomeIcon icon={faAngleDown} className={'iu-color-main'} aria-label="Kolumnen sorteras fallande" />
        </SortingButton>
      )
    } else {
      return (
        <SortingButton aria-label="Sortera på kolumn">
          <FontAwesomeIcon icon={faAngleUp} />
          <FontAwesomeIcon icon={faAngleDown} />
        </SortingButton>
      )
    }
  }

  const getTableHeadings = () => {
    return headings.map((heading) => (
      <th key={heading.id + '-heading'} id={heading.id} scope="col" onClick={onTableHeadClick} data-html data-tip={heading.description}>
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
      <thead>
        <tr>{getTableHeadings()}</tr>
      </thead>
      {caption && <Caption>{caption}</Caption>}
      <tbody>
        {!isLoadingContent && !isEmptyList && <>{children}</>}
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
      </tbody>
    </StyledTable>
  )
}

export default Table
