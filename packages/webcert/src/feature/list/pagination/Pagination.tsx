import * as React from 'react'
import styled from 'styled-components/macro'

interface Props {
  page: number
  pageTuple: number
  totalPages: number
  handlePageChange: (updatedPage: number) => void
  handlePageTupleChange: (updatedPageTuple: number) => void
  startFrom: number
  pageSize: number
  totalCount: number
}

const PaginationWrapper = styled.div`
  button {
    background: none !important;
    border: none;
    padding: 0 !important;
    color: #5f5f5f;
  }

  button:hover {
    color: #01a5a3;
  }

  display: flex;
  gap: 12px;
  justify-content: end;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  handlePageChange,
  handlePageTupleChange,
  pageTuple,
  startFrom,
  pageSize,
  totalCount,
}) => {
  const pagesPerTuple = 10
  const finalPageTuple = Math.ceil(totalPages / pagesPerTuple)

  const handlePreviousClick = () => {
    if (!isPreviousDisabled()) {
      return handlePageTupleChange(pageTuple - 1)
    }
  }

  const handleNextClick = () => {
    if (!isNextDisabled()) {
      return handlePageTupleChange(pageTuple + 1)
    }
  }

  const getPageIndex = (index: number) => {
    const startValue = (pageTuple - 1) * pagesPerTuple + 1
    return startValue + index
  }

  const getNumbers = () => {
    const numberOfPages = pageTuple === finalPageTuple ? totalPages - (finalPageTuple - 1) * pagesPerTuple : pagesPerTuple
    return [...Array(numberOfPages)].map((element, index) => {
      return (
        <button
          onClick={() => handlePageChange(getPageIndex(index))}
          className={getPageIndex(index) === page ? 'iu-color-main iu-fw-heading' : ''}>
          {getPageIndex(index)}
        </button>
      )
    })
  }

  const getNumberOfHitsText = () => {
    const isLastPage = totalPages === page
    const start = startFrom + 1
    const end = !isLastPage ? startFrom + pageSize : totalCount
    return (
      <>
        {totalPages > 1 ? (
          <p>
            Visar {start} - {end} av {totalCount} träffar
          </p>
        ) : (
          <p>
            Visar {start} av {end} träffar
          </p>
        )}
      </>
    )
  }

  const isPreviousDisabled = () => {
    return pageTuple === 1
  }

  const isNextDisabled = () => {
    return pageTuple === finalPageTuple
  }

  return (
    <Wrapper className="iu-py-500 iu-display-flex">
      {getNumberOfHitsText()}
      <PaginationWrapper>
        <button
          disabled={isPreviousDisabled()}
          className={!isPreviousDisabled() ? '' : 'iu-color-grey-400'}
          onClick={() => handlePreviousClick()}>
          Föregående
        </button>
        {getNumbers()}
        <button
          disabled={isNextDisabled()}
          className={!isNextDisabled() ? '' : 'inactive iu-color-grey-400'}
          onClick={() => handleNextClick()}>
          Nästa
        </button>
      </PaginationWrapper>
    </Wrapper>
  )
}

export default Pagination
