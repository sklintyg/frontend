import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { LoginFailedError } from './LoginFailedError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <LoginFailedError />
    </ErrorContext.Provider>
  )
}

describe('LoginFailedError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(/inloggning misslyckades/i)).toBeInTheDocument()
  })

  it('displays link', async () => {
    renderComponent()
    expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  })
})
