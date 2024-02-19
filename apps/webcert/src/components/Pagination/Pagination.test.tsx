import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('should not render pagination pages and buttons if only one page', () => {
    render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={9} startFrom={10} pagesPerTuple={10} />)
    expect(screen.queryByText('Visa mer')).not.toBeInTheDocument()
    expect(screen.queryByText('Visa färre')).not.toBeInTheDocument()
    expect(screen.queryByText('Nästa')).not.toBeInTheDocument()
    expect(screen.queryByText('Föregående')).not.toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  describe('Next and previous buttons', () => {
    it('should display next button', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={10} pagesPerTuple={10} />)
      expect(screen.getByRole('button', { name: 'Nästa' })).toBeInTheDocument()
    })

    it('should display previous button', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={10} pagesPerTuple={10} />)
      expect(screen.getByRole('button', { name: 'Föregående' })).toBeInTheDocument()
    })

    it('should disable previous button if on first page', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Föregående' })).toBeDisabled()
    })

    it('should disabled next button if on last page', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={110} startFrom={109} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Nästa' })).toBeDisabled()
    })

    it('should run page change function with page and start from when clicking on next', async () => {
      const onPageChange = vi.fn()
      render(<Pagination onPageChange={onPageChange} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      await userEvent.click(screen.getByRole('button', { name: 'Nästa' }))
      expect(onPageChange).toHaveBeenCalledWith(10)
    })

    it('should run page change function with page and start from when clicking on previous', async () => {
      const onPageChange = vi.fn()
      render(<Pagination onPageChange={onPageChange} pageSize={10} totalCount={200} startFrom={10} pagesPerTuple={10} />)
      await userEvent.click(screen.getByRole('button', { name: 'Föregående' }))
      expect(onPageChange).toHaveBeenCalledWith(0)
    })
  })

  describe('Show more and show less buttons', () => {
    it('should display show more button', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      expect(screen.getByRole('button', { name: 'Visa mer' })).toBeInTheDocument()
    })

    it('should display show less button', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      expect(screen.getByRole('button', { name: 'Visa färre' })).toBeInTheDocument()
    })

    it('should disable show less button if on first page tuple', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Visa färre' })).toBeDisabled()
    })

    it('should disabled show more button if on last page tuple', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={110} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Visa mer' })).toBeDisabled()
    })

    it('should run page tuple change function with page tuple + 1 when clicking on next', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Visa mer' })).toBeEnabled()
      await userEvent.click(screen.getByRole('button', { name: 'Visa mer' }))
      await expect(screen.getByRole('button', { name: 'Visa mer' })).toBeDisabled()
    })

    it('should run page tuple change function with page tuple - 1 when clicking on next', async () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={110} pagesPerTuple={10} />)
      await expect(screen.getByRole('button', { name: 'Visa färre' })).toBeEnabled()
      await userEvent.click(screen.getByRole('button', { name: 'Visa färre' }))
      await expect(screen.getByRole('button', { name: 'Visa färre' })).toBeDisabled()
    })
  })

  describe('Page numbers', () => {
    it('should display ten numbers per tuple', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      ;[...Array(10)].forEach((_, index) => {
        expect(screen.getByRole('button', { name: `${index + 1}` })).toBeInTheDocument()
      })
    })

    it('should display ten numbers for second tuple', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={100} pagesPerTuple={10} />)
      ;[...Array(10)].forEach((_, index) => {
        expect(screen.getByRole('button', { name: `${index + 11}` })).toBeInTheDocument()
      })
    })

    it('should display last tuple as less than 10 sides if necessary', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={210} startFrom={299} pagesPerTuple={10} />)
      expect(screen.getByRole('button', { name: '21' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '22' })).not.toBeInTheDocument()
    })

    it('should run function with updated page and start from when page is clicked', async () => {
      const onPageChange = vi.fn()
      render(<Pagination onPageChange={onPageChange} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      await userEvent.click(screen.getByRole('button', { name: '5' }))
      expect(onPageChange).toHaveBeenCalledWith(40)
    })
  })

  describe('Number of hits text', () => {
    it('should show hits 1 to 10 for first page', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={1} pagesPerTuple={10} />)
      expect(screen.getByText('Visar 1 - 10 av 200 träffar')).toBeInTheDocument()
    })

    it('should show hits 11 to 20 for first page', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={200} startFrom={10} pagesPerTuple={10} />)
      expect(screen.getByText('Visar 11 - 20 av 200 träffar')).toBeInTheDocument()
    })

    it('should show specific text if only one page', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={9} startFrom={1} pagesPerTuple={10} />)
      expect(screen.getByText('Visar 9 av 9 träffar')).toBeInTheDocument()
    })

    it('should not break with page higher than last to last page', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={10} totalCount={20} startFrom={99} pagesPerTuple={10} />)
      expect(screen.getByText('Visar 11 - 20 av 20 träffar')).toBeInTheDocument()
    })

    it('should reset page tuple higher than last to last page tuple', () => {
      render(<Pagination onPageChange={vi.fn()} pageSize={2} totalCount={20} startFrom={99} pagesPerTuple={10} />)
      expect(screen.getByText('Visar 19 - 20 av 20 träffar')).toBeInTheDocument()
    })
  })
})
