import { useCallback, useEffect } from 'react'
import { Pagination } from '../../../components/Pagination/Pagination'
import { performListSearch, updateActiveListFilterValue } from '../../../store/list/listActions'
import { getActiveListFilterValue, getListTotalCount } from '../../../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { ListFilterType } from '../../../types'

const ListPagination = () => {
  const pageSize = useAppSelector(getActiveListFilterValue('PAGESIZE', ListFilterType.NUMBER))
  const startFrom = useAppSelector(getActiveListFilterValue('START_FROM', ListFilterType.NUMBER))
  const totalCount = useAppSelector(getListTotalCount)
  const dispatch = useAppDispatch()

  const handlePageChange = useCallback(
    (startFrom: number) => {
      dispatch(updateActiveListFilterValue({ id: 'START_FROM', filterValue: { type: ListFilterType.NUMBER, value: startFrom } }))
      dispatch(performListSearch())
    },
    [dispatch]
  )

  useEffect(() => {
    if (startFrom && totalCount && pageSize) {
      const currentPage = Math.floor(startFrom.value / pageSize.value) + 1
      const totalPages = Math.ceil(totalCount / pageSize.value)
      if (currentPage > totalPages) {
        handlePageChange(pageSize.value * (totalPages - 1))
      }
    }
  }, [dispatch, handlePageChange, pageSize, startFrom, totalCount])

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
