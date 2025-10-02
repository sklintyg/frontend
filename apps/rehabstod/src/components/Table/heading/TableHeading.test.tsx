import { render, screen } from '@testing-library/react'
import { TableHeading } from './TableHeading'

const TITLE = 'Title'
const SUB_TITLE = 'Sub title'
const PRINT_TITLE = 'Print title'

const renderComponent = () => {
  render(<TableHeading title={TITLE} subTitle={SUB_TITLE} printTitle={PRINT_TITLE} />)
}

describe('TableHeading', () => {
  it('should render without throwing error', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should show sub title', () => {
    renderComponent()
    expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
  })

  it('should only print title for printing', () => {
    renderComponent()
    expect(screen.queryByTestId('table-print-heading')).toHaveClass('hidden print:block')
  })
})
