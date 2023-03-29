import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableLayout } from './TableLayout'

let onSort: () => void
const renderComponent = () =>
  render(
    <TableLayout
      title="Title"
      subTitle="Sub title"
      tableHeaders={['H1', 'H2']}
      content={[]}
      id="id"
      filters={<p>Filters</p>}
      onSort={onSort}
      sortedColumn={0}
      ascending={false}
      isLoading={false}
      infoBar={<p>Infobar</p>}
    />
  )

describe('TableLayout', () => {
  beforeEach(() => {
    renderComponent()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('should show sub title', () => {
    expect(screen.getByText('Sub title')).toBeInTheDocument()
  })

  it('should show first table header', () => {
    expect(screen.getByText('H1')).toBeInTheDocument()
  })

  it('should show second table header', () => {
    expect(screen.getByText('H2')).toBeInTheDocument()
  })

  it('should show filters', () => {
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it.skip('should call on sort when pressing table header', () => {
    userEvent.click(screen.getByText('H2'))
    expect(onSort).toHaveBeenCaled()
  })
})
