import classNames from 'classnames'
import * as React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import NumberOfHitsText from './NumberOfHitsText'

interface Props {
  page: number
  pageTuple: number
  handlePageChange: (updatedPage: number, startFrom: number) => void
  handlePageTupleChange: (updatedPageTuple: number) => void
  pageSize: number
  totalCount: number
  pagesPerTuple: number
}

const PaginationWrapper = styled.div`
  button {
    background: none !important;
    border: none;
    color: #5f5f5f;
    font-family: inherit;
    line-height: inherit;
  }

  button:hover {
    color: #01a5a3;
  }

  button:disabled {
    cursor: text;
    font-style: italic;
  }

  .active {
    text-decoration: underline;
  }

  display: flex;
  gap: 12px;
  justify-content: end;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Pagination: React.FC<Props> = ({ page, handlePageChange, handlePageTupleChange, pageTuple, pageSize, totalCount, pagesPerTuple }) => {
  const totalPages = Math.ceil(totalCount / pageSize)
  const finalPageTuple = Math.ceil(totalPages / pagesPerTuple)

  const getStartFrom = (updatedPage: number) => {
    return (updatedPage - 1) * pageSize
  }

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      handlePageChange(totalPages, getStartFrom(totalPages))
    }

    if (pageTuple > finalPageTuple && finalPageTuple > 0) {
      handlePageTupleChange(finalPageTuple)
    }
  })

  if (totalPages === 0) {
    return null
  }

  const handlePreviousClick = () => {
    if (!isPreviousDisabled()) {
      return handlePageChange(page - 1, getStartFrom(page - 1))
    }
  }

  const handleNextClick = () => {
    if (!isNextDisabled()) {
      return handlePageChange(page + 1, getStartFrom(page + 1))
    }
  }

  const handleShowMoreClick = () => {
    if (!isShowMoreDisabled()) {
      return handlePageTupleChange(pageTuple + 1)
    }
  }

  const handleShowLessClick = () => {
    if (!isShowLessDisabled()) {
      return handlePageTupleChange(pageTuple - 1)
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

  const isShowLessDisabled = () => {
    return pageTuple === 1
  }

  const isShowMoreDisabled = () => {
    return pageTuple === finalPageTuple
  }

  const isPreviousDisabled = () => {
    return page === 1
  }

  const isNextDisabled = () => {
    return page === totalPages
  }

  return (
    <Wrapper className="iu-py-500">
      <NumberOfHitsText totalPages={totalPages} page={page} startFrom={getStartFrom(page)} totalCount={totalCount} pageSize={pageSize} />
      {totalPages > 1 && (
        <PaginationWrapper>
          <button
            disabled={isShowLessDisabled()}
            className={classNames({ 'iu-color-grey-400': isShowLessDisabled() })}
            onClick={() => handleShowLessClick()}>
            Visa färre
          </button>
          <button
            disabled={isPreviousDisabled()}
            className={classNames({ 'iu-color-grey-400': isPreviousDisabled() })}
            onClick={() => handlePreviousClick()}>
            Föregående
          </button>
          <div aria-activedescendant={'page-button-' + page} tabIndex={-1}>
            {getNumbers()}
          </div>
          <button
            disabled={isNextDisabled()}
            className={classNames({ 'iu-color-grey-400': isNextDisabled() })}
            onClick={() => handleNextClick()}>
            Nästa
          </button>
          <button
            disabled={isShowMoreDisabled()}
            className={classNames({ 'iu-color-grey-400': isShowMoreDisabled() })}
            onClick={() => handleShowMoreClick()}>
            Visa mer
          </button>
        </PaginationWrapper>
      )}
    </Wrapper>
  )
}

export default Pagination
