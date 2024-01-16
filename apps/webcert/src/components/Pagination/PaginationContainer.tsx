import { useState } from 'react'
import Pagination from './Pagination'

interface Props {
  onPageChange: (page: number, startFrom: number) => void
  pageSize: number
  totalCount: number
  startFrom: number
  pagesPerTuple: number
}

const PaginationContainer: React.FC<Props> = ({ onPageChange, pageSize, totalCount, startFrom, pagesPerTuple }) => {
  const getInitialPage = () => {
    return Math.floor(startFrom / pageSize) + 1
  }

  const getInitialPageTuple = () => {
    return Math.floor(startFrom / (pageSize * pagesPerTuple) + 1)
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage())
  const [currentPageTuple, setCurrentPageTuple] = useState(getInitialPageTuple())

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
      pagesPerTuple={pagesPerTuple}
    />
  )
}

export default PaginationContainer
