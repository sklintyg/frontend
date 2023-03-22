import { render, screen } from '@testing-library/react'
import { TableLayout } from './TableLayout'
import { SickLeaveInfo } from '../../store/types/sickLeave'

const renderComponent = () => {
  return render(
    <TableLayout title="Title" subTitle="Sub title" tableHeaders={['H1', 'H2']} content={[]} id="id" filters={<p>Filters</p>} />
  )
}

describe('TableLayout', () => {
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
})
