import { render, screen } from '@testing-library/react'
import { TableHeader } from './TableHeader'
import { Table } from './Table'

const columns = [
  { name: 'Personnummer', width: 50 },
  { name: 'Ålder', width: 100, description: 'Namn beskrivning' },
]

const renderComponent = () => {
  render(
    <Table>
      <TableHeader columns={columns} />
    </Table>
  )
}

describe('TableHeader', () => {
  it('should render component without throwing error', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should present column name', () => {
    renderComponent()
    expect(screen.getByText('Personnummer')).toBeInTheDocument()
  })

  it('should present column name with swedish letters', () => {
    renderComponent()
    expect(screen.getByText('Ålder')).toBeInTheDocument()
  })
})
