import type React from 'react';
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import Spinner from '../../components/utils/Spinner'
import type { TableHeading } from '../../types'
import { SortingArrow } from './SortingArrow'

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

  const highlighted = 1 + headings.findIndex((heading) => orderBy === heading.id)

  return (
    <StyledTable className="ic-table ic-table--full" highlighted={highlighted}>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th
              key={heading.id + '-heading'}
              id={heading.id}
              scope="col"
              onClick={onTableHeadClick}
              data-html
              data-tip={heading.description}
            >
              <span className="iu-mr-500">{heading.title}</span>
              {heading.title && <SortingArrow id={heading.id} orderBy={orderBy} ascending={ascending} />}
            </th>
          ))}
        </tr>
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
