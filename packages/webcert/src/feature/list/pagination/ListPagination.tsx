import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { ListFilterType, ListFilterValueNumber } from '@frontend/common/src/types/list'
import PaginationContainer from '../../../../../common/src/components/Pagination/PaginationContainer'

const ListPagination: React.FC = () => {
  const pageSize = useSelector(getActiveListFilterValue('PAGESIZE')) as ListFilterValueNumber
  const totalCount = useSelector(getListTotalCount)
  const dispatch = useDispatch()

  const handlePageChange = (updatedPage: number, startFrom: number) => {
    dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: startFrom } }))
    dispatch(performListSearch)
  }

  return <PaginationContainer onPageChange={handlePageChange} pageSize={pageSize ? pageSize.value : 0} totalCount={totalCount} />
}

export default ListPagination
