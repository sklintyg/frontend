import * as React from 'react'
import styled from 'styled-components/macro'
import NumberOfHitsText from './NumberOfHitsText'

interface Props {
  page: number
  pageTuple: number
  handlePageChange: (updatedPage: number, startFrom: number) => void
  handlePageTupleChange: (updatedPageTuple: number) => void
  pageSize: number
  totalCount: number
}

const PaginationWrapper = styled.div`
  button {
    background: none !important;
    border: none;
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

const Pagination: React.FC<Props> = ({ page, handlePageChange, handlePageTupleChange, pageTuple, pageSize, totalCount }) => {
  const pagesPerTuple = 10
  const totalPages = Math.ceil(totalCount / pageSize)
  const finalPageTuple = Math.ceil(totalPages / pagesPerTuple)

  if (totalPages < 1) {
    return null
  }

  const getStartFrom = (updatedPage: number) => {
    return (updatedPage - 1) * pageSize
  }

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
          id={'page-button-' + index}
          key={'page-button-' + index}
          onClick={() => handlePageChange(getPageIndex(index), getStartFrom(getPageIndex(index)))}
          className={getPageIndex(index) === page ? 'iu-color-main iu-fw-heading active iu-px-200' : 'iu-px-200'}>
          {getPageIndex(index)}
        </button>
      )
    })
  }

  const isPreviousDisabled = () => {
    return pageTuple === 1
  }

  const isNextDisabled = () => {
    return pageTuple === finalPageTuple
  }

  return (
    <Wrapper className="iu-py-500 iu-display-flex">
      <NumberOfHitsText totalPages={totalPages} page={page} startFrom={getStartFrom(page)} totalCount={totalCount} pageSize={pageSize} />
      <PaginationWrapper>
        <button
          disabled={isPreviousDisabled()}
          className={!isPreviousDisabled() ? '' : 'iu-color-grey-400'}
          onClick={() => handlePreviousClick()}>
          Föregående
        </button>
        <div aria-activedescendant={'page-button-' + page}>{getNumbers()}</div>
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
