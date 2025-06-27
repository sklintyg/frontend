import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from '../../../components/Pagination/Pagination'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'
import type { ListFilterValueNumber } from '../../../types'
import { ListFilterType } from '../../../types'

const ListPagination = () => {
  const pageSize = useSelector(getActiveListFilterValue('PAGESIZE')) as ListFilterValueNumber
  const startFrom = useSelector(getActiveListFilterValue('START_FROM')) as ListFilterValueNumber
  const totalCount = useSelector(getListTotalCount)
  const dispatch = useDispatch()

  const handlePageChange = (startFrom: number) => {
    dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: startFrom } }))
    dispatch(performListSearch)
  }

  return (
    <Pagination
      onPageChange={handlePageChange}
      pageSize={pageSize ? pageSize.value : 0}
      totalCount={totalCount ? totalCount : 0}
      startFrom={startFrom ? startFrom.value : 0}
      pagesPerTuple={10}
    />
  )
}

export default ListPagination
