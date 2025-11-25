import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fakeResourceLink, fakeUser } from '../faker'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateIsLoadingUser, updateUser, updateUserResourceLinks } from '../store/user/userActions'
import { updateDynamicLinks } from '../store/utils/utilsActions'
import { ResourceLinkType } from '../types'
import { UnauthorizedPage } from './UnauthorizedPage'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <UnauthorizedPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.NOT_AUTHORIZED_PRIVATE_PRACTITIONER })]))
    testStore.dispatch(updateIsLoadingUser(false))
    testStore.dispatch(
      updateDynamicLinks({
        ineraNationellaKundservice: {
          key: 'ineraNationellaKundservice',
          url: 'https://www.inera.se/kundservice',
          text: 'Ineras nationella kundservice',
          target: '_blank',
          tooltip: 'Länk till Ineras nationella kundservice',
        },
      })
    )
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('Page content', () => {
    it('should render page title', () => {
      renderComponent()

      const link = screen.getByRole('link', { name: /Ineras nationella kundservice/i })
      const lists = screen.getAllByRole('list')
      const reasonsList = lists.find((list) => {
        const items = within(list).getAllByRole('listitem')
        return items.length === 3
      })
      const listItems = within(reasonsList!).getAllByRole('listitem')

      expect(screen.getByRole('heading', { name: 'Du är inte behörig att använda Webcert', level: 1 })).toBeInTheDocument()
      expect(screen.getByText('Du är inte behörig att använda Webcert. Det kan bero på att:')).toBeInTheDocument()
      expect(screen.getByText(/Ditt konto är skapat och vi bearbetar din registrering/, { exact: false })).toBeInTheDocument()
      expect(
        screen.getByText(/Du enligt Socialstyrelsens register för Hälso- och sjukvårdspersonal \(HOSP\) inte är legitimerad läkare/, {
          exact: false,
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Inera AB av någon anledning har beslutat att stänga av dig från tjänsten/, { exact: false })
      ).toBeInTheDocument()
      expect(reasonsList).toBeDefined()
      expect(listItems).toHaveLength(3)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://www.inera.se/kundservice')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
})
