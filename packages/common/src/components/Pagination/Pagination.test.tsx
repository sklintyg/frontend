import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReactDOM from 'react-dom/client'
import { vi } from 'vitest'
import Pagination from './Pagination'
import { act } from 'react-dom/test-utils'

const handlePageChange = vi.fn()
const handlePageTupleChange = vi.fn()
let container: Element | null

const renderComponent = (page = 1, pageTuple = 1, pageSize = 10, totalCount = 200) => {
  act(() => {
    ReactDOM.createRoot(container).render(
      <Pagination
        page={page}
        pageTuple={pageTuple}
        handlePageChange={handlePageChange}
        handlePageTupleChange={handlePageTupleChange}
        pageSize={pageSize}
        totalCount={totalCount}
        pagesPerTuple={10}
      />
    )
  })
}

describe('Pagination', () => {
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  it('should not render pagination pages and buttons if only one page', () => {
    renderComponent(1, 1, 10, 9)
    expect(screen.queryByText('Visa mer')).not.toBeInTheDocument()
    expect(screen.queryByText('Visa färre')).not.toBeInTheDocument()
    expect(screen.queryByText('Nästa')).not.toBeInTheDocument()
    expect(screen.queryByText('Föregående')).not.toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  describe('Next and previous buttons', () => {
    it('should display next button', () => {
      renderComponent()
      expect(screen.getByText('Nästa')).toBeInTheDocument()
    })

    it('should display previous button', () => {
      renderComponent()
      expect(screen.getByText('Föregående')).toBeInTheDocument()
    })

    it('should disable previous button if on first page', () => {
      renderComponent(1, 2)
      expect(screen.getByText('Föregående')).toBeDisabled()
    })

    it('should disabled next button if on last page', () => {
      renderComponent(11, 1, 10, 110)
      expect(screen.getByText('Nästa')).toBeDisabled()
    })

    it('should run page change function with page and start from when clicking on next', async () => {
      renderComponent()
      await act(() => userEvent.click(screen.getByText('Nästa')))
      expect(handlePageChange).toHaveBeenCalledWith(2, 10)
    })

    it('should run page change function with page and start from when clicking on previous', async () => {
      renderComponent(2, 2, 10, 110)
      await act(() => userEvent.click(screen.getByText('Föregående')))
      expect(handlePageChange).toHaveBeenCalledWith(1, 0)
    })
  })

  describe('Show more and show less buttons', () => {
    it('should display show more button', () => {
      renderComponent()
      expect(screen.getByText('Visa mer')).toBeInTheDocument()
    })

    it('should display show less button', () => {
      renderComponent()
      expect(screen.getByText('Visa färre')).toBeInTheDocument()
    })

    it('should disable show less button if on first page tuple', () => {
      renderComponent(1, 1)
      expect(screen.getByText('Visa färre')).toBeDisabled()
    })

    it('should disabled show more button if on last page tuple', () => {
      renderComponent(11, 2, 10, 110)
      expect(screen.getByText('Visa mer')).toBeDisabled()
    })

    it('should run page tuple change function with page tuple + 1 when clicking on next', async () => {
      renderComponent()
      await act(() => userEvent.click(screen.getByText('Visa mer')))
      expect(handlePageTupleChange).toHaveBeenCalledWith(2)
    })

    it('should run page tuple change function with page tuple - 1 when clicking on next', async () => {
      renderComponent(1, 2, 10, 110)
      await act(() => userEvent.click(screen.getByText('Visa färre')))
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

    it('should run function with updated page and start from when page is clicked', async () => {
      renderComponent()
      await act(() => userEvent.click(screen.getByText('5')))
      expect(handlePageChange).toHaveBeenCalledWith(5, 40)
    })
  })

  describe('Number of hits text', () => {
    it('should show hits 1 to 10 for first page', () => {
      renderComponent()
      expect(screen.getByText('Visar 1 - 10 av 200 träffar')).toBeInTheDocument()
    })

    it('should show hits 11 to 20 for first page', () => {
      renderComponent(2)
      expect(screen.getByText('Visar 11 - 20 av 200 träffar')).toBeInTheDocument()
    })

    it('should show specific text if only one page', () => {
      renderComponent(1, 1, 10, 9)
      expect(screen.getByText('Visar 9 av 9 träffar')).toBeInTheDocument()
    })

    it('should reset page higher than last to last page', () => {
      renderComponent(100, 1, 10, 20)
      expect(handlePageChange).toHaveBeenCalledWith(2, 10)
    })

    it('should reset page tuple higher than last to last page tuple', () => {
      renderComponent(1, 100, 10, 20)
      expect(handlePageTupleChange).toHaveBeenCalledWith(1)
    })
  })
})
