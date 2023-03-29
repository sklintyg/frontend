import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { TableLayout } from './TableLayout'

const onSort = vi.fn()
const renderComponent = () =>
  render(
    <TableLayout
      title="Title"
      subTitle="Sub title"
      tableHeaders={['H1', 'H2']}
      tableHeaderDescriptions={['Desc1,', 'Desc2']}
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

  it('should show info bar', () => {
    expect(screen.getByText('Infobar')).toBeInTheDocument()
  })
})
