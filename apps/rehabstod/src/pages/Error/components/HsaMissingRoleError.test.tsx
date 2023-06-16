import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import { renderWithRouter } from '../../../utils/renderWithRouter'
import { ErrorContext } from '../Error'
import { MissingHsaRoleError } from './HsaMissingRoleError'

const renderComponent = () => {
  renderWithRouter(
    <ErrorContext.Provider value="abc123">
      <MissingHsaRoleError />
    </ErrorContext.Provider>
  )
}
describe('HsaMissingRoleError component', () => {
  it('should render without a problem', () => {
    expect(() => renderComponent()).not.toThrow()
  })
  it('should render title', () => {
    renderComponent()
    expect(screen.getByText(/behörighet saknas/i)).toBeInTheDocument()
  })
  it('should render text', () => {
    renderComponent()
    expect(
      screen.getByText(
        /För att logga in som Rehabkoordinator krävs att du har den rollen för vårdenheten i HSA. Kontakta din lokala HSA-administratör för behörighet./i
      )
    ).toBeInTheDocument()
  })
})
