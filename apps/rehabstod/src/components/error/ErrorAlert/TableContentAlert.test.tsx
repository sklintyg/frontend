import { screen } from '@testing-library/react'
import { TableContentAlert } from './TableContentAlert'
import { renderWithRouter } from '../../../utils/renderWithRouter'

const TABLE_NAME = 'sjukfall'
const error = { ...new Error('Something went wrong'), id: 'some-id-string' }
const renderComponent = () => {
  renderWithRouter(<TableContentAlert tableName={TABLE_NAME} error={error} />)
}

describe('TableContentAlert', () => {
  it('should render without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should return error description with table name', () => {
    renderComponent()
    expect(
      screen.getByText(
        'Sjukfall för enheten kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand'
      )
    ).toBeInTheDocument()
  })
})
