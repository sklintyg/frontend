import * as React from 'react'
import { useState } from 'react'
import Pagination from './Pagination'

interface Props {
  totalPages: number
  onPageChange: (page: number) => void
  startFrom: number
  pageSize: number
  totalCount: number
}

const PaginationContainer: React.FC<Props> = ({ totalPages, onPageChange, startFrom, pageSize, totalCount }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageTuple, setCurrentPageTuple] = useState(1)

  const handlePageChange = (updatedPage: number) => {
    setCurrentPage(updatedPage)
    onPageChange(updatedPage)
  }
  const handlePageTupleChange = (updatedPageTuple: number) => setCurrentPageTuple(updatedPageTuple)

  if (totalPages <= 1) {
    return null
  }

  return (
    <>
      <div className="container">
        <Pagination
          page={currentPage}
          pageTuple={currentPageTuple}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          handlePageTupleChange={handlePageTupleChange}
          startFrom={startFrom}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </>
  )
}

export default PaginationContainer
