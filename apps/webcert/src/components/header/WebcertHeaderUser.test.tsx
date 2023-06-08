import { getPrivatePractitionerPortalResourceLink, getUser } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import WebcertHeaderUser from './WebcertHeaderUser'

let testStore: EnhancedStore

const getUserPreferences = (approvedTerms: string) => {
  return { 'wc.vardperson.sekretess.approved': approvedTerms }
}

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <WebcertHeaderUser />
    </Provider>
  )
}

describe('WebcertHeaderUser', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  it('displays user role', () => {
    testStore.dispatch(updateUser({ ...getUser(), role: 'Läkare' }))
    renderComponent()
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('displays users name and role', (): void => {
    testStore.dispatch(updateUser({ ...getUser(), role: 'Läkare', name: 'Test Testsson' }))
    renderComponent()
    expect(screen.getByText(/Test Testsson/i)).toBeInTheDocument()
    expect(screen.getByText(/Läkare/i)).toBeInTheDocument()
  })

  it('should not show protected person link', (): void => {
    testStore.dispatch(updateUser({ ...getUser(), protectedPerson: false }))
    renderComponent()
    expect(screen.queryByText(/Skyddade personuppgifter/i)).not.toBeInTheDocument()
  })

  it('should show protected person modal if approval is not saved in preferences', (): void => {
    testStore.dispatch(updateUser({ ...getUser(), protectedPerson: true }))
    renderComponent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Du har skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should show protected person link when approval modal gets closed', (): void => {
    testStore.dispatch(updateUser({ ...getUser(), protectedPerson: true }))
    renderComponent()
    userEvent.click(screen.getByRole('checkbox'))
    userEvent.click(screen.getByText('Till Webcert'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should not show protected person modal if approval is saved in preferences', (): void => {
    testStore.dispatch(
      updateUser({
        ...getUser(),
        protectedPerson: true,
        preferences: getUserPreferences('true'),
      })
    )
    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText(/Du har skyddade personuppgifter/i)).not.toBeInTheDocument()
  })

  it('should show protected person link when approval modal is closed', (): void => {
    testStore.dispatch(
      updateUser({
        ...getUser(),
        protectedPerson: true,
        preferences: getUserPreferences('true'),
      })
    )
    renderComponent()
    expect(screen.getByText(/Skyddade personuppgifter/i)).toBeInTheDocument()
  })

  it('should open protected person modal when clicking on link', (): void => {
    testStore.dispatch(
      updateUser({
        ...getUser(),
        protectedPerson: true,
        preferences: getUserPreferences('true'),
      })
    )
    renderComponent()
    userEvent.click(screen.getByText(/Skyddade personuppgifter/i))
    expect(screen.getByText('Användning av Webcert med skyddade personuppgifter')).toBeInTheDocument()
  })

  it('should show private practitioner portal link dropdown', () => {
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(updateUserResourceLinks(getPrivatePractitionerPortalResourceLink()))
    renderComponent()
    expect(screen.getByTestId('arrowToggle')).toBeInTheDocument()
  })

  it('should show private practitioner portal link', () => {
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(updateUserResourceLinks(getPrivatePractitionerPortalResourceLink()))
    renderComponent()
    userEvent.click(screen.getByTestId('arrowToggle'))
    expect(screen.getByText('Min sida')).toBeInTheDocument()
  })

  it('should expand/collapse when clicked on expandableBox', () => {
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(updateUserResourceLinks(getPrivatePractitionerPortalResourceLink()))
    renderComponent()
    const expandableBox = screen.getByTestId('expandableBox')
    userEvent.click(expandableBox)
    expect(screen.getByText('Min sida')).toBeInTheDocument()
    userEvent.click(expandableBox)
    expect(screen.queryByText('Min sida')).not.toBeInTheDocument()
  })
})
