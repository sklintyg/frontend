import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { EmptyTableAlert } from './EmptyTableAlert'

it('Should display alert', async () => {
  const tableName = 'tableName'
  renderWithRouter(<EmptyTableAlert tableName={tableName} />)
  expect(await screen.findByRole('alert')).toBeInTheDocument()
})
