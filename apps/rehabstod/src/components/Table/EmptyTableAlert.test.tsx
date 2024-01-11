import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { EmptyTableAlert } from './EmptyTableAlert'
import { renderWithRouter } from '../../utils/renderWithRouter'

it('Should display alert', async () => {
  const tableName = 'tableName'
  renderWithRouter(<EmptyTableAlert tableName={tableName} />)
  expect(await screen.findByRole('alert')).toBeInTheDocument()
})
