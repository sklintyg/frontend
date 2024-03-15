import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import Spinner from '../../components/utils/Spinner'
import { ChevronUpIcon, ChevronDownIcon } from '../../images'
import { TableHeading } from '../../types'

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

  .no-results {
    td {
      background-color: white !important;
    }
  }

  th {
    cursor: pointer;
    white-space: nowrap;
  }
`

const SortingButton = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  color: #5f5f5f;
  font-size: 0.68em;
  vertical-align: 0.165em;
  min-width: 2em;
`

export const ListTable: React.FC<Props> = ({
  orderBy,
  ascending,
  caption,
  isLoadingContent,
  isEmptyList,
  children,
  headings,
  onTableHeadClick,
}) => {
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
          <ChevronUpIcon size="sm" className={'iu-color-main'} aria-label="Kolumnen sorteras stigande" />
        </SortingButton>
      ) : (
        <SortingButton aria-label="Byt till att sortera stigande">
          <ChevronDownIcon size="sm" className={'iu-color-main'} aria-label="Kolumnen sorteras fallande" />
        </SortingButton>
      )
    } else {
      return (
        <SortingButton aria-label="Sortera på kolumn">
          <ChevronUpIcon size="sm" />
          <ChevronDownIcon size="sm" />
        </SortingButton>
      )
    }
  }

  const getTableHeadings = () => {
    return headings.map((heading) => (
      <th key={heading.id + '-heading'} id={heading.id} scope="col" onClick={onTableHeadClick} data-html data-tip={heading.description}>
        <span className="iu-mr-500">{heading.title}</span>
        {getSortingArrow(heading.id, heading.title)}
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
          <tr className="no-results">
            <td className="iu-border-white">
              <Spinner className={'iu-mt-300'} />
            </td>
          </tr>
        )}
        {!isLoadingContent && isEmptyList && (
          <tr className="no-results">
            <td className="iu-border-white iu-bg-white">
              <p>Inga resultat att visa.</p>
            </td>
          </tr>
        )}
      </tbody>
    </StyledTable>
  )
}
