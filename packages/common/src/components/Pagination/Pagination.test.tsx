import { render, screen } from '@testing-library/react'
import React from 'react'
import Pagination from './Pagination'
import userEvent from '@testing-library/user-event'

const handlePageChange = jest.fn()
const handlePageTupleChange = jest.fn()

const renderComponent = (page = 1, pageTuple = 1, pageSize = 10, totalCount = 200) => {
  render(
    <Pagination
      page={page}
      pageTuple={pageTuple}
      handlePageChange={handlePageChange}
      handlePageTupleChange={handlePageTupleChange}
      pageSize={pageSize}
      totalCount={totalCount}
    />
  )
}

describe('Pagination', () => {
  describe('Next and previous buttons', () => {
    it('should display next button', () => {
      renderComponent()
      expect(screen.getByText('Nästa')).toBeInTheDocument()
    })

    it('should display previous button', () => {
      renderComponent()
      expect(screen.getByText('Föregående')).toBeInTheDocument()
    })

    it('should disable previous button if on first page tuple', () => {
      renderComponent()
      expect(screen.getByText('Föregående')).toBeDisabled()
    })

    it('should disabled next button if on last page tuple', () => {
      renderComponent(1, 2, 10, 110)
      expect(screen.getByText('Nästa')).toBeDisabled()
    })

    it('should run page tuple change function with page tuple + 1 when clicking on next', () => {
      renderComponent()
      userEvent.click(screen.getByText('Nästa'))
      expect(handlePageTupleChange).toHaveBeenCalledWith(2)
    })

    it('should run page tuple change function with page tuple - 1 when clicking on next', () => {
      renderComponent(1, 2, 10, 110)
      userEvent.click(screen.getByText('Föregående'))
      expect(handlePageTupleChange).toHaveBeenCalledWith(1)
    })
  })

  describe('Page numbers', () => {
    it('should display ten numbers per tuple', () => {
      renderComponent()
      ;[...Array(10)].forEach((element, index) => {
        expect(screen.getByText((index + 1).toString())).toBeInTheDocument()
      })
    })

    it('should display ten numbers for second tuple', () => {
      renderComponent(10, 2)
      ;[...Array(10)].forEach((element, index) => {
        expect(screen.getByText((index + 11).toString())).toBeInTheDocument()
      })
    })

    it('should display last tuple as less than 10 sides if necessary', () => {
      renderComponent(1, 3, 10, 210)
      expect(screen.getByText((21).toString())).toBeInTheDocument()
      expect(screen.queryByText((22).toString())).not.toBeInTheDocument()
    })

    it('should run function with updated page and start from when page is clicked', () => {
      renderComponent()
      userEvent.click(screen.getByText('5'))
      expect(handlePageChange).toHaveBeenCalledWith(5, 40)
    })
  })

  describe('Number of hits text', () => {
    it('should show hits 1 to 10 for first page', () => {
      renderComponent()
      expect(screen.getByText('Visar 1 - 10 av 200 träffar')).toBeInTheDocument()
    })
  })
})
