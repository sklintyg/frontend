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
  .inactive {
    cursor: auto;
  }

  a {
    cursor: pointer;
  }

  a:hover {
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
    if (pageTuple !== 1) {
      return handlePageTupleChange(pageTuple - 1)
    }
  }

  const handleNextClick = () => {
    if (pageTuple !== finalPageTuple) {
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
        <a
          onClick={() => handlePageChange(getPageIndex(index))}
          className={getPageIndex(index) === page ? 'iu-color-main iu-fw-heading' : ''}>
          {getPageIndex(index)}
        </a>
      )
    })
  }

  return (
    <Wrapper className="iu-py-500 iu-display-flex">
      <p>
        Visar {startFrom + 1} - {startFrom + pageSize} av {totalCount} träffar
      </p>
      <PaginationWrapper>
        <a className={pageTuple !== 1 ? '' : 'inactive iu-color-grey-400'} onClick={() => handlePreviousClick()}>
          Föregående
        </a>
        {getNumbers()}
        <a className={pageTuple !== finalPageTuple ? '' : 'inactive iu-color-grey-400'} onClick={() => handleNextClick()}>
          Nästa
        </a>
      </PaginationWrapper>
    </Wrapper>
  )
}

export default Pagination
