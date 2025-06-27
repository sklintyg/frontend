import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import DisplayError from '../../components/error/DisplayError'
import InfoBox from '../../components/utils/InfoBox'
import Spinner from '../../components/utils/Spinner'
import { performListSearch, updateActiveListFilterValue, updateIsSortingList } from '../../store/list/listActions'
import { getListError } from '../../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../../store/store'
import type { ListConfig, ListFilter, TableHeading } from '../../types'
import { ListFilterType } from '../../types'
import { SortingArrow } from './SortingArrow'

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

const getOrderBy = (filter: ListFilter | undefined) => {
  const val = filter?.values?.['ORDER_BY']
  if (val?.type === ListFilterType.ORDER) {
    return val.value ?? ''
  }
  return ''
}

const getAscending = (filter: ListFilter | undefined) => {
  const val = filter?.values?.['ASCENDING']
  if (val?.type === ListFilterType.BOOLEAN) {
    return val.value
  }
  return false
}

export function ListTable({
  caption,
  isLoadingContent,
  isEmptyList,
  children,
  headings,
  filter,
  config,
}: Readonly<{
  caption?: string
  children: React.ReactNode
  headings: TableHeading[]
  isLoadingContent: boolean
  isEmptyList: boolean
  filter: ListFilter | undefined
  config: ListConfig
}>) {
  const dispatch = useAppDispatch()
  const listError = useAppSelector(getListError)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  if (listError) {
    return (
      <InfoBox type="error">
        <DisplayError errorCode={listError?.errorCode} fallback="Sökningen kunde inte utföras." />
      </InfoBox>
    )
  }

  const updateSortingOfList = (event: React.MouseEvent<HTMLTableCellElement>) => {
    if (event.currentTarget.innerHTML) {
      const updatedOrderBy = event.currentTarget.id
      const isCurrentSorting = getOrderBy(filter) === updatedOrderBy
      const defaultSortOrder = config.tableHeadings.find((heading) => heading.id === updatedOrderBy)?.defaultAscending
      const ascendingValue = isCurrentSorting ? !getAscending(filter) : Boolean(defaultSortOrder)

      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.ORDER, value: updatedOrderBy },
          id: 'ORDER_BY',
        })
      )

      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.BOOLEAN, value: ascendingValue },
          id: 'ASCENDING',
        })
      )

      dispatch(updateIsSortingList(true))
      dispatch(performListSearch)
    }
  }

  const highlighted = 1 + headings.findIndex((heading) => getOrderBy(filter) === heading.id)

  return (
    <StyledTable className="ic-table ic-table--full" highlighted={highlighted}>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th
              key={heading.id + '-heading'}
              id={heading.id}
              scope="col"
              onClick={updateSortingOfList}
              data-html
              data-tip={heading.description}
            >
              <span className="iu-mr-500">{heading.title}</span>
              {heading.title && <SortingArrow id={heading.id} orderBy={getOrderBy(filter)} ascending={getAscending(filter)} />}
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
