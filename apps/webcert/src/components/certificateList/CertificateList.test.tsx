import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fakePatient, fakeResourceLink } from '../../faker'
import { fakeCertificateConfirmationModal } from '../../faker/certificate/fakeCertificateConfirmationModal'
import { updateCreatedCertificateId } from '../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setPatient, updateCertificateTypes } from '../../store/patient/patientActions'
import { patientMiddleware } from '../../store/patient/patientMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserPreference } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import type { CertificateType, User } from '../../types'
import { ResourceLinkType } from '../../types'
import { CertificateList } from './CertificateList'

const createType = ({
  description = '',
  detailedDescription = '',
  id = '',
  issuerTypeId = '',
  label = '',
  links = [],
  message = '',
  confirmationModal = null,
}: Partial<CertificateType>): CertificateType => ({
  description,
  detailedDescription,
  id,
  issuerTypeId,
  label,
  links,
  message,
  confirmationModal,
})

let testStore: EnhancedStore
let types: CertificateType[]

const renderComponent = () =>
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<CertificateList />} />
          <Route path="/certificate/certificateId" element="you are on the certificate page" />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('CertificateList', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, userMiddleware, patientMiddleware])

    types = [
      createType({
        id: 'typ1',
        label: 'Typ 1',
        message: 'Meddelande',
        links: [
          fakeResourceLink({ type: ResourceLinkType.CREATE_CERTIFICATE, name: 'Skapa intyg' }),
          fakeResourceLink({ type: ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION }),
        ],
      }),
      createType({
        id: 'typ2',
        label: 'Typ 2',
        links: [fakeResourceLink({ type: ResourceLinkType.CREATE_CERTIFICATE, name: 'Skapa intyg' })],
      }),
      createType({ id: 'typ3', label: 'Typ 3' }),
      createType({ id: 'typ4', label: 'Typ 4' }),
      createType({ id: 'typ5', label: 'Typ 5' }),
      createType({
        id: 'typ6',
        label: 'Typ 6',
        links: [
          fakeResourceLink({ type: ResourceLinkType.CREATE_CERTIFICATE, name: 'Skapa intyg' }),
          fakeResourceLink({ type: ResourceLinkType.CREATE_LUAENA_CONFIRMATION, name: 'Luaena saknas' }),
        ],
      }),
      createType({
        id: 'typ7',
        label: 'Typ 7',
        confirmationModal: fakeCertificateConfirmationModal(),
        links: [fakeResourceLink({ type: ResourceLinkType.CREATE_CERTIFICATE, name: 'Skapa intyg' })],
      }),
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

  it('should order favorite certificate types first', () => {
    dispatchFavorites(['typ2', 'typ4'])
    renderComponent()

    const labels = screen.getAllByText('Typ', { exact: false }).map((el) => el.textContent?.trim())
    expect(labels).toEqual(['Typ 2', 'Typ 4', 'Typ 1', 'Typ 3', 'Typ 5', 'Typ 6', 'Typ 7'])
  })

  it('should add favorites', async () => {
    renderComponent()

    const buttons = screen.getAllByLabelText('Markera intyget som favorit och fäst högst upp i listan.')
    await userEvent.click(buttons[1])

    expect(buttons[1]).toMatchSnapshot()
  })

  it('should remove favorites', async () => {
    renderComponent()

    const buttons = screen.getAllByLabelText('Markera intyget som favorit och fäst högst upp i listan.')
    await userEvent.click(buttons[1])
    await userEvent.click(buttons[1])

    expect(buttons[1]).toMatchSnapshot()
  })

  it('should show modal when clicked', async () => {
    renderComponent()

    const aboutLink = screen.getAllByText('Om intyget')[0] as HTMLElement
    await userEvent.click(aboutLink)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should redirect user when certificate id is set', () => {
    testStore.dispatch(updateCreatedCertificateId('certificateId'))

    renderComponent()

    expect(screen.getByText(/you are on the certificate page/i)).toBeInTheDocument()
  })

  it('should clear certificate id after certificate id is set', () => {
    testStore.dispatch(updateCreatedCertificateId('certificateId'))

    renderComponent()

    expect(testStore.getState().ui.uiCertificate.createdCertificateId).toEqual('')
  })

  it('should show message when it exists', () => {
    renderComponent()

    expect(screen.getByText('Meddelande')).toBeInTheDocument()
  })

  it('should show confirm modal when CREATE_LUAENA_CONFIRMATION resource link exists', async () => {
    testStore.dispatch(setPatient(fakePatient()))
    renderComponent()

    const button = screen.getAllByRole('button', {
      name: /Skapa intyg/,
    })
    await userEvent.click(button[2])

    expect(screen.getByText('Du är på väg att utfärda Läkarutlåtande för', { exact: false })).toBeInTheDocument()
  })

  it('should show modal when MISSING_RELATED_CERTIFICATE_CONFIRMATION resource link exists', async () => {
    testStore.dispatch(setPatient(fakePatient()))
    renderComponent()

    const button = screen.getAllByRole('button', {
      name: /Skapa intyg/,
    })
    await userEvent.click(button[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('Should show general confirmation modal', async () => {
    testStore.dispatch(setPatient(fakePatient()))
    renderComponent()

    const row = screen.getByTestId('certificate-list-row-typ7')
    expect(row).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: 'Skapa intyg' })).toBeInTheDocument()

    await userEvent.click(within(row).getByRole('button', { name: 'Skapa intyg' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
