import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { Home } from './Home'

it('Should render without error', () => {
  expect(() => renderWithRouter(<Home />)).not.toThrow()
})

it('Should present user once logged in', async () => {
  renderWithRouter(<Home />)

  await waitForElementToBeRemoved(document.querySelector('ids-spinner'))

  expect(screen.getByText('Hej Karolina Ek PhD')).toBeInTheDocument()
})
