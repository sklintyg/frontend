import { Pagination } from '../../../components/Pagination/Pagination'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import type { ListFilterValueNumber } from '../../../types'
import { ListFilterType } from '../../../types'

const ListPagination = () => {
  const pageSize = useAppSelector(getActiveListFilterValue('PAGESIZE')) as ListFilterValueNumber
  const startFrom = useAppSelector(getActiveListFilterValue('START_FROM')) as ListFilterValueNumber
  const totalCount = useAppSelector(getListTotalCount)
  const dispatch = useAppDispatch()

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
