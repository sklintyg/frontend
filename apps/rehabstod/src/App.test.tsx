import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { App } from './App'
import { renderWithRouter } from './utils/renderWithRouter'

test('full app rendering/navigating', async () => {
  const { user } = renderWithRouter(<App />)

  await waitForElementToBeRemoved(document.querySelector('ids-spinner'))

  expect(screen.getByText(/välkommen till rehabstöd/i)).toBeInTheDocument()

  await user.click(screen.getByTestId('login-btn'))
  expect(screen.getByText(/den här sidan hittades inte/i)).toBeInTheDocument()

  screen.debug()
})
