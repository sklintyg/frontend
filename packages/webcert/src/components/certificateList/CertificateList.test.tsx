import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import React from 'react'
import { CertificateType, CertificateTypeLink, User } from '@frontend/common'
import reducer from '../../store/reducers'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import CertificateList from './CertificateList'
import { userMiddleware } from '../../store/user/userMiddleware'
import { updateUser, updateUserPreference } from '../../store/user/userActions'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { updateCreatedCertificateId } from '../../store/certificate/certificateActions'
import { updateCertificateTypes } from '../../store/patient/patientActions'

const createType = ({
  description = '',
  detailedDescription = '',
  id = '',
  issuerTypeId = '',
  label = '',
  links = [],
}: {
  description?: string
  detailedDescription?: string
  id?: string
  issuerTypeId?: string
  label?: string
  links?: CertificateTypeLink[]
}): CertificateType => ({
  description,
  detailedDescription,
  id,
  issuerTypeId,
  label,
  links,
})

let testStore: EnhancedStore
let types: CertificateType[]
let container: HTMLElement
const testHistory = createBrowserHistory()
testHistory.push = jest.fn()

const renderComponent = (): HTMLElement => {
  const { container } = render(
    <Provider store={testStore}>
      <Router history={testHistory}>
        <CertificateList />
      </Router>
    </Provider>
  )
  return container
}

describe('StartPage', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, userMiddleware),
    })

    types = [
      createType({ id: 'typ1', label: 'Typ 1' }),
      createType({ id: 'typ2', label: 'Typ 2' }),
      createType({ id: 'typ3', label: 'Typ 3' }),
      createType({ id: 'typ4', label: 'Typ 4' }),
      createType({ id: 'typ5', label: 'Typ 5' }),
    ]

    testStore.dispatch(updateCertificateTypes(types))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  const dispatchFavorites = (favorites: string[]) => {
    testStore.dispatch(updateUser({ preferences: null } as User))
    testStore.dispatch(updateUserPreference({ key: 'wc.favoritIntyg', value: JSON.stringify(favorites) }))
  }

  it('should render list of certificate types', () => {
    renderComponent()

    const labels = screen.getAllByText('Typ', { exact: false }).map((el) => el.textContent?.trim())
    expect(labels).toEqual(types.map((t) => t.label))
  })

  it('should toggle saved favorites', () => {
    dispatchFavorites(['typ3', 'typ5'])
    container = renderComponent()

    const labels = Array.from(container.querySelectorAll('.iu-color-information')).map((el) =>
      el.parentElement?.nextSibling?.textContent?.trim()
    )
    expect(labels).toEqual(['Typ 3', 'Typ 5'])
  })

  it('should order favorite certificate types first', () => {
    dispatchFavorites(['typ2', 'typ4'])
    renderComponent()

    const labels = screen.getAllByText('Typ', { exact: false }).map((el) => el.textContent?.trim())
    expect(labels).toEqual(['Typ 2', 'Typ 4', 'Typ 1', 'Typ 3', 'Typ 5'])
  })

  it('should add favorites', () => {
    container = renderComponent()

    const icon = screen.getByText('Typ 1').previousSibling?.firstChild as HTMLElement
    userEvent.click(icon)

    expect(icon).toHaveAttribute('class', expect.stringContaining('iu-color-information'))
  })

  it('should remove favorites', () => {
    dispatchFavorites(['typ1'])
    container = renderComponent()

    const icon = screen.getByText('Typ 1').previousSibling?.firstChild as HTMLElement
    userEvent.click(icon)

    expect(icon).toHaveAttribute('class', expect.stringContaining('iu-color-muted'))
  })

  it('should show modal when clicked', () => {
    renderComponent()

    const aboutLink = screen.getAllByText('Om intyget')[0] as HTMLElement
    userEvent.click(aboutLink)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('should redirect user when certificate id is set', () => {
    testStore.dispatch(updateCreatedCertificateId('certificateId'))

    renderComponent()

    expect(testHistory.push).toHaveBeenCalledWith('/certificate/certificateId')
  })

  it('should clear certificate id after certificate id is set', () => {
    testStore.dispatch(updateCreatedCertificateId('certificateId'))

    renderComponent()

    expect(testStore.getState().ui.uiCertificate.createdCertificateId).toEqual('')
  })
})
