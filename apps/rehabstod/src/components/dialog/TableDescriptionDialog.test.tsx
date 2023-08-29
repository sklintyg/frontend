import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableDescriptionDialog } from './TableDescriptionDialog'
import { Column } from '../Table/types/Column'

const columns: Column[] = [{ name: 'Column 1', description: 'Column 1 description' }, { name: 'Column 2' }]

const renderComponent = () => {
  render(<TableDescriptionDialog columns={columns} />)
}

describe('TableDescriptionDialog', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render button for modal', () => {
    renderComponent()
    expect(screen.getByText('Beskrivning av tabellens rubriker')).toBeInTheDocument()
  })

  it('should show title of columns with description', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Beskrivning av tabellens rubriker'))
    expect(screen.getByText(columns[0].name)).toBeInTheDocument()
  })

  it('should show description', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Beskrivning av tabellens rubriker'))
    expect(screen.getByText(columns[0].description)).toBeInTheDocument()
  })

  it('should not show title of columns without description', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Beskrivning av tabellens rubriker'))
    expect(screen.queryByText(columns[1].name)).not.toBeInTheDocument()
  })
})
