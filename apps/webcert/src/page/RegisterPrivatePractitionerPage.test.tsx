import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fakeResourceLink, fakeUser } from '../faker'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks } from '../store/user/userActions'
import { ResourceLinkType } from '../types'
import { RegisterPrivatePractitionerPage } from './RegisterPrivatePractitionerPage'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <RegisterPrivatePractitionerPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('RegisterPrivatePractitionerPage', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
    testStore.dispatch(updateUser(fakeUser()))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Page content', () => {
    it('should render page title', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Skapa konto i Webcert', level: 1 })).toBeInTheDocument()
    })

    it('should render introductory text', () => {
      renderComponent()

      expect(
        screen.getByText(/Du har genomfört en beställning av abonnemang för Webcert i Ineras kundportal/, { exact: false })
      ).toBeInTheDocument()
      expect(screen.getByText(/Intyg som utfärdas med BankID är enbart den enskilde läkarens intyg/, { exact: false })).toBeInTheDocument()
    })

    it('should render "Så fungerar det" section', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Så fungerar det', level: 2 })).toBeInTheDocument()
    })
  })

  describe('Steps', () => {
    it('should render step 1 - lämna uppgifter', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Steg 1 - lämna uppgifter', level: 3 })).toBeInTheDocument()
      expect(screen.getByText(/Du lämnar uppgifter om dig själv och din verksamhet/, { exact: false })).toBeInTheDocument()
    })

    it('should render step 2 - uppgifter verifieras', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Steg 2 - uppgifter verifieras', level: 3 })).toBeInTheDocument()
      expect(
        screen.getByText(/Din yrkeslegitimation verifieras automatiskt mot Socialstyrelsens register/, { exact: false })
      ).toBeInTheDocument()
    })

    it('should render step 3 - börja använda Webcert', () => {
      renderComponent()

      expect(screen.getByRole('heading', { name: 'Steg 3 - börja använda Webcert', level: 3 })).toBeInTheDocument()
      expect(screen.getByText(/Efter godkänd verifiering mot Socialstyrelsens register/, { exact: false })).toBeInTheDocument()
    })

    it('should render list icon for step 1', () => {
      renderComponent()

      const listIcon = screen.getByAltText('List')
      expect(listIcon).toBeInTheDocument()
      expect(listIcon).toHaveAttribute('tabIndex', '0')
    })

    it('should render id card icon for step 2', () => {
      renderComponent()

      const idCardIcon = screen.getByAltText('Id Card')
      expect(idCardIcon).toBeInTheDocument()
      expect(idCardIcon).toHaveAttribute('tabIndex', '0')
    })

    it('should render check icon for step 3', () => {
      renderComponent()

      const checkIcon = screen.getByAltText('Check')
      expect(checkIcon).toBeInTheDocument()
      expect(checkIcon).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Buttons', () => {
    it('should render "Skapa konto" button', () => {
      renderComponent()

      expect(screen.getByRole('button', { name: 'Skapa konto' })).toBeInTheDocument()
    })

    it('should render "Avbryt och logga ut" button with modified text when log out link is available', () => {
      testStore.dispatch(
        updateUserResourceLinks([
          fakeResourceLink({
            type: ResourceLinkType.LOG_OUT,
            name: 'Logga ut',
            enabled: true,
          }),
        ])
      )

      renderComponent()

      expect(screen.getByText('Avbryt och logga ut')).toBeInTheDocument()
    })

    it('should not render "Avbryt och logga ut" button when log out link is not available', () => {
      testStore.dispatch(updateUserResourceLinks([]))

      renderComponent()

      expect(screen.queryByText(/Avbryt och/)).not.toBeInTheDocument()
    })

    it('should render "Skapa konto" button as primary button', () => {
      renderComponent()

      const createAccountButton = screen.getByRole('button', { name: 'Skapa konto' })
      expect(createAccountButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Resource links', () => {
    it('should use LOG_OUT resource link type', () => {
      const logoutLink = fakeResourceLink({
        type: ResourceLinkType.LOG_OUT,
        name: 'Logga ut',
        enabled: true,
      })

      testStore.dispatch(updateUserResourceLinks([logoutLink]))

      renderComponent()

      expect(screen.getByText('Avbryt och logga ut')).toBeInTheDocument()
    })

    it('should transform logout link name to lowercase', () => {
      const logoutLink = fakeResourceLink({
        type: ResourceLinkType.LOG_OUT,
        name: 'LOGGA UT',
        enabled: true,
      })

      testStore.dispatch(updateUserResourceLinks([logoutLink]))

      renderComponent()

      expect(screen.getByText('Avbryt och logga ut')).toBeInTheDocument()
    })
  })
})
