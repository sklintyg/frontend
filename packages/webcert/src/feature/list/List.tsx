import * as React from 'react'
import { CertificateListItem, ListConfig, ListFilter, ListFilterType } from '@frontend/common/src/types/list'
import Table from '@frontend/common/src/components/Table/Table'
import { useDispatch, useSelector } from 'react-redux'
import { performListSearch, updateActiveListFilterValue, updateIsSortingList } from '../../store/list/listActions'
import ListPagination from './pagination/ListPagination'
import { getIsLoadingList, getIsSortingList } from '../../store/list/listSelectors'
import ListFilterContainer from './filter/ListFilterContainer'
import ListItemContent from './ListItemContent'

interface Props {
  config: ListConfig | undefined
  list: CertificateListItem[]
  filter: ListFilter | undefined
  title: string
}

const List: React.FC<Props> = ({ config, list, filter, title }) => {
  const dispatch = useDispatch()
  const isLoadingList = useSelector(getIsLoadingList)
  const isSortingList = useSelector(getIsSortingList)

  if (!config) {
    return null
  }

  const getTable = () => {
    return list.map((listItem) => <tr>{getTableData(listItem)}</tr>)
  }

  const getTableData = (listItem: CertificateListItem) => {
    return config.tableHeadings.map((heading) => {
      return (
        <ListItemContent
          key={heading.id}
          value={listItem.values[heading.id]}
          valueType={heading.type}
          openCertificateTooltip={config ? config.openCertificateTooltip : ''}
        />
      )
    })
  }

  const getOrderBy = () => {
    return filter && filter.values && filter.values['ORDER_BY'] ? filter.values['ORDER_BY'].value : ''
  }

  const getAscending = () => {
    return filter && filter.values && filter.values['ASCENDING'] && filter.values['ASCENDING'].value
  }

  const getUpdatedAscendingValue = (updatedOrderBy: string) => {
    const isCurrentSorting = getOrderBy() === updatedOrderBy
    const defaultSortOrder = config.tableHeadings.find((heading) => heading.id === updatedOrderBy)?.defaultAscending
    if (isCurrentSorting) {
      return !getAscending()
    }
    return defaultSortOrder
  }

  const updateSortingOfList = (event: React.MouseEvent<HTMLTableHeaderCellElement>) => {
    if (event.currentTarget.innerHTML) {
      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.ORDER, value: event.currentTarget.id },
          id: 'ORDER_BY',
        })
      )

      dispatch(
        updateActiveListFilterValue({
          filterValue: { type: ListFilterType.BOOLEAN, value: getUpdatedAscendingValue(event.currentTarget.id) },
          id: 'ASCENDING',
        })
      )

      dispatch(updateIsSortingList(true))
      dispatch(performListSearch)
    }
  }

  const getListContent = () => {
    return (
      <Table
        caption={config.title}
        headings={config.tableHeadings}
        orderBy={getOrderBy() as string}
        ascending={getAscending() as boolean}
        onTableHeadClick={updateSortingOfList}
        isLoadingContent={isLoadingList && !isSortingList}
        isEmptyList={list.length === 0}>
        {getTable()}
      </Table>
    )
  }

  return (
    <>
      <h3 className="iu-pt-500">{title}</h3>
      <ListFilterContainer config={config} filter={filter} />
      {getListContent()}
      {(!isLoadingList || isSortingList) && <ListPagination />}
    </>
  )
}

export default List
