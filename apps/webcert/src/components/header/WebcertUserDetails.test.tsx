import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fakeResourceLink, fakeUser } from '../../faker'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import { ResourceLinkType } from '../../types'
import { WebcertUserDetails } from './WebcertUserDetails'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <WebcertUserDetails user={fakeUser({ name: 'Test Testsson', role: 'Läkare' })} />
      </MemoryRouter>
    </Provider>
  )
}

describe('WebcertUserDetails', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  describe('Normal status', () => {
    it('displays user name and role on same line', () => {
      testStore.dispatch(updateUser(fakeUser({ name: 'Test Testsson', role: 'Läkare' })))
      renderComponent()
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('- Läkare')).toBeInTheDocument()
    })

    it('displays edit link when enabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER })]))
      renderComponent()
      expect(screen.getByRole('link', { name: /Ändra uppgifter/i })).toBeInTheDocument()
    })

    it('does not display edit link when disabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      renderComponent()
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })

  describe('Not authorized status', () => {
    it('displays user name and label separately', () => {
      testStore.dispatch(updateUser(fakeUser({ name: 'Test Testsson' })))
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER })]))
      renderComponent()
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('Ej behörig')).toBeInTheDocument()
    })

    it('displays edit link with separator when enabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(
        updateUserResourceLinks([
          fakeResourceLink({ type: ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER }),
        ])
      )
      renderComponent()
      expect(screen.getByText('|')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Ändra uppgifter/i })).toBeInTheDocument()
    })

    it('does not display edit link or separator when disabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER })]))
      renderComponent()
      expect(screen.queryByText('|')).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })

  describe('Not registered status', () => {
    it('displays user name and label separately', () => {
      testStore.dispatch(updateUser(fakeUser({ name: 'Test Testsson' })))
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER })]))
      renderComponent()
      expect(screen.getByText('Test Testsson')).toBeInTheDocument()
      expect(screen.getByText('Ej registrerad')).toBeInTheDocument()
    })

    it('does not display edit link even when enabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(
        updateUserResourceLinks([
          fakeResourceLink({ type: ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER }),
          fakeResourceLink({ type: ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER }),
        ])
      )
      renderComponent()
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })

    it('does not display edit link when disabled', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.ACCESS_REGISTER_PRIVATE_PRACTITIONER })]))
      renderComponent()
      expect(screen.queryByRole('link', { name: /Ändra uppgifter/i })).not.toBeInTheDocument()
    })
  })
})
