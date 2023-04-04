import { screen } from '@testing-library/react'
import { fakeUser } from '../../utils/fake'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { CareProvider } from './CareProvider'

it('Should render without error', () => {
  expect(() => renderWithRouter(<CareProvider />)).not.toThrow()
})

it('Should render Välj enhet', async () => {
  renderWithRouter(<CareProvider />)
  expect(await screen.findByText('Välj enhet')).toBeInTheDocument()
})

it('displays an alert when user.roleSwitchPossible is true', async () => {
  fakeUser({ roleSwitchPossible: true })
  renderWithRouter(<CareProvider />)
  const alertText =
    'Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från Läkare till Rehabkoordinator när du väljer att logga in på en sådan enhet.'
  expect(await screen.findByText(alertText)).toBeInTheDocument()
})

it('Should not display an alert when user.roleSwitchPossible is false', async () => {
  fakeUser({ roleSwitchPossible: false })
  renderWithRouter(<CareProvider />)
  const alertText =
    'Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från Läkare till Rehabkoordinator när du väljer att logga in på en sådan enhet.'
  expect(await screen.queryByText(alertText)).not.toBeInTheDocument()
})
