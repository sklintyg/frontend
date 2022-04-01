import * as React from 'react'
import { useState } from 'react'
import Pagination from './Pagination'

interface Props {
  onPageChange: (page: number, startFrom: number) => void
  pageSize: number
  totalCount: number
}

const PaginationContainer: React.FC<Props> = ({ onPageChange, pageSize, totalCount }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageTuple, setCurrentPageTuple] = useState(1)

  const handlePageChange = (updatedPage: number, startFrom: number) => {
    setCurrentPage(updatedPage)
    onPageChange(updatedPage, startFrom)
  }
  const handlePageTupleChange = (updatedPageTuple: number) => setCurrentPageTuple(updatedPageTuple)

  return (
    <Pagination
      page={currentPage}
      pageTuple={currentPageTuple}
      handlePageChange={handlePageChange}
      handlePageTupleChange={handlePageTupleChange}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  )
}

export default PaginationContainer
