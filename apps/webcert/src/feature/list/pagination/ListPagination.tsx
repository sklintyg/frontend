import { ListFilterType, ListFilterValueNumber, PaginationContainer } from '@frontend/common'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'

const ListPagination: React.FC = () => {
  const pageSize = useSelector(getActiveListFilterValue('PAGESIZE')) as ListFilterValueNumber
  const startFrom = useSelector(getActiveListFilterValue('START_FROM')) as ListFilterValueNumber
  const totalCount = useSelector(getListTotalCount)
  const dispatch = useDispatch()

  const handlePageChange = (updatedPage: number, startFrom: number) => {
    dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: startFrom } }))
    dispatch(performListSearch)
  }

  return (
    <PaginationContainer
      onPageChange={handlePageChange}
      pageSize={pageSize ? pageSize.value : 0}
      totalCount={totalCount ? totalCount : 0}
      startFrom={startFrom ? startFrom.value : 0}
      pagesPerTuple={10}
    />
  )
}

export default ListPagination
