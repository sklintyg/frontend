import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveListFilterValue, getListTotalCount, getListTotalPages } from '../../../store/list/listSelectors'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { ListFilterType, ListFilterValueNumber } from '@frontend/common/src/types/list'
import PaginationContainer from './PaginationContainer'

const ListPagination: React.FC = () => {
  const pageSize = useSelector(getActiveListFilterValue('PAGESIZE')) as ListFilterValueNumber
  const totalPages = useSelector(getListTotalPages(pageSize ? pageSize.value : 0))
  const startFrom = useSelector(getActiveListFilterValue('START_FROM')) as ListFilterValueNumber
  const totalCount = useSelector(getListTotalCount)
  const dispatch = useDispatch()

  const getStartFrom = (page: number) => {
    if (pageSize) {
      return (page - 1) * pageSize.value
    }
    return 0
  }

  const handlePageChange = (updatedPage: number) => {
    const startFrom = getStartFrom(updatedPage)
    dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: startFrom } }))
    dispatch(performListSearch)
  }

  return (
    <PaginationContainer
      totalPages={totalPages}
      onPageChange={handlePageChange}
      startFrom={startFrom ? startFrom.value : 0}
      pageSize={pageSize ? pageSize.value : 0}
      totalCount={totalCount}
    />
  )
}

export default ListPagination
