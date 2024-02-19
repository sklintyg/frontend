import { range } from 'lodash-es'
import { useState } from 'react'
import styled from 'styled-components'
import { NumberOfHitsText } from './NumberOfHitsText'
import { PaginationButton } from './PaginationButton'

const PaginationWrapper = styled.div`
  display: flex;
  gap: 0.4375rem;
  justify-content: end;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const getStartFrom = (index: number, pageSize: number) => {
  return (index - 1) * pageSize
}

export function Pagination({
  onPageChange,
  pageSize,
  totalCount,
  startFrom,
  pagesPerTuple,
}: {
  onPageChange: (startFrom: number) => void
  pageSize: number
  totalCount: number
  startFrom: number
  pagesPerTuple: number
}) {
  const startAt = Math.min(totalCount - 1, startFrom)
  const currentPage = Math.floor(startAt / pageSize) + 1
  const totalPages = Math.ceil(totalCount / pageSize)
  const finalPageTuple = Math.ceil(totalPages / pagesPerTuple)
  const [currentPageTuple, updateCurrentPageTuple] = useState(
    Math.min(finalPageTuple, Math.floor(startAt / (pageSize * pagesPerTuple) + 1))
  )
  const numberOfPages = currentPageTuple === finalPageTuple ? totalPages - (finalPageTuple - 1) * pagesPerTuple : pagesPerTuple
  const pageTupleStartAt = (currentPageTuple - 1) * pagesPerTuple + 1

  if (totalPages === 0) {
    return null
  }

  return (
    <Wrapper className="iu-py-500">
      <NumberOfHitsText
        totalPages={totalPages}
        page={currentPage}
        startFrom={getStartFrom(currentPage, pageSize)}
        totalCount={totalCount}
        pageSize={pageSize}
      />
      {totalPages > 1 && (
        <PaginationWrapper>
          <PaginationButton disabled={currentPageTuple === 1} onClick={() => updateCurrentPageTuple(currentPageTuple - 1)}>
            Visa färre
          </PaginationButton>
          <PaginationButton disabled={currentPage === 1} onClick={() => onPageChange(getStartFrom(currentPage - 1, pageSize))}>
            Föregående
          </PaginationButton>
          <div aria-activedescendant={'page-button-' + currentPage} tabIndex={-1}>
            {range(pageTupleStartAt, pageTupleStartAt + numberOfPages).map((pageIndex) => (
              <PaginationButton
                key={pageIndex}
                onClick={() => onPageChange(getStartFrom(pageIndex, pageSize))}
                active={currentPage === pageIndex}
              >
                {pageIndex}
              </PaginationButton>
            ))}
          </div>
          <PaginationButton disabled={currentPage === totalPages} onClick={() => onPageChange(getStartFrom(currentPage + 1, pageSize))}>
            Nästa
          </PaginationButton>
          <PaginationButton disabled={currentPageTuple === finalPageTuple} onClick={() => updateCurrentPageTuple(currentPageTuple + 1)}>
            Visa mer
          </PaginationButton>
        </PaginationWrapper>
      )}
    </Wrapper>
  )
}

export default Pagination
