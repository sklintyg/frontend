import { screen } from '@testing-library/react'
import { App } from './App'
import { renderWithRouter } from './utils/renderWithRouter'

// eslint-disable-next-line jest/no-disabled-tests
test.skip('full app rendering/navigating', async () => {
  const { user } = renderWithRouter(<App />)

  expect(screen.getByText(/välkommen till rehabstöd/i)).toBeInTheDocument()

  await user.click(screen.getByTestId('login-btn'))
  expect(screen.getByText(/den här sidan hittades inte/i)).toBeInTheDocument()
})
