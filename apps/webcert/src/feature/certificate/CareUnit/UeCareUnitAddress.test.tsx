import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCertificateMetaData, fakeResourceLink, fakeUnit } from '../../../faker'
import { resetCertificateState, showValidationErrors, updateCertificate } from '../../../store/certificate/certificateActions'
import store from '../../../store/store'
import { ResourceLinkType, type ValidationError } from '../../../types'
import UeCareUnitAddress, {
  CARE_UNIT_ADDRESS_FIELD,
  CARE_UNIT_CITY_FIELD,
  CARE_UNIT_PHONE_NUMBER_FIELD,
  CARE_UNIT_ZIP_CODE_FIELD,
} from './UeCareUnitAddress'

const getValidationErrors = (): ValidationError[] => {
  const address: ValidationError = { id: '', category: '', field: CARE_UNIT_ADDRESS_FIELD, type: '', text: 'Valideringstext' }
  const zipCode: ValidationError = { id: '', category: '', field: CARE_UNIT_ZIP_CODE_FIELD, type: '', text: 'Valideringstext' }
  const city: ValidationError = { id: '', category: '', field: CARE_UNIT_CITY_FIELD, type: '', text: 'Valideringstext' }
  const phoneNumber: ValidationError = { id: '', category: '', field: CARE_UNIT_PHONE_NUMBER_FIELD, type: '', text: 'Valideringstext' }
  return [address, zipCode, city, phoneNumber]
}

function renderComponent() {
  return render(
    <Provider store={store}>
      <UeCareUnitAddress />
    </Provider>
  )
}

describe('CareUnitAddress component', () => {
  let modalRoot: HTMLDivElement

  beforeEach(() => {
    store.dispatch(resetCertificateState())
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('display all input fields with labels, mandatory and no validation errors', (): void => {
    renderComponent()

    expect(screen.getByRole('heading', { name: /vårdenhetens adress/i })).toBeInTheDocument()
    expect(screen.getByText(/postadress/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postadress/i })).toBeInTheDocument()
    expect(screen.getByText(/postnummer/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postnummer/i })).toBeInTheDocument()
    expect(screen.getByText(/postort/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postort/i })).toBeInTheDocument()
    expect(screen.getByText(/telefonnummer/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toBeInTheDocument()
    expect(screen.queryAllByText('Valideringstext')).toHaveLength(0)
    expect(screen.queryAllByText(/\*/i)).toHaveLength(4)
  })

  it('display all validation errors', async () => {
    store.dispatch(showValidationErrors())
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            careUnitValidationErrors: getValidationErrors(),
          }),
        })
      )
    )

    renderComponent()

    expect(screen.queryAllByText('Valideringstext')).toHaveLength(4)
    await expect(screen.getByRole('textbox', { name: /postadress/i })).toHaveClass('ic-textarea--error')
    await expect(screen.getByRole('textbox', { name: /postnummer/i })).toHaveClass('ic-textfield--error')
    await expect(screen.getByRole('textbox', { name: /postort/i })).toHaveClass('ic-textfield--error')
    await expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toHaveClass('ic-textfield--error')
  })

  it('display no validation errors', (): void => {
    renderComponent()

    expect(screen.queryAllByText('Valideringstext')).toHaveLength(0)
  })

  it('do not display mandatory', (): void => {
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            unit: fakeUnit({
              unitId: 'unitId',
              unitName: 'unitName',
              address: 'address',
              zipCode: '12345',
              city: 'city',
              phoneNumber: '123456789',
              email: 'email',
            }),
          }),
        })
      )
    )

    renderComponent()

    expect(screen.queryAllByText(/\*/i)).toHaveLength(0)
  })

  it('numeric inputs should only allow numbers', async () => {
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            unit: fakeUnit({
              phoneNumber: '',
              zipCode: '',
            }),
          }),
          links: [fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE })],
        })
      )
    )

    renderComponent()

    const zipcodeInput = screen.getByRole('textbox', { name: /postnummer/i })
    const phoneNumberInput = screen.getByRole('textbox', { name: /telefonnummer/i })

    await userEvent.type(zipcodeInput, '1a2b3c4d5e6f')
    await expect(zipcodeInput).toHaveValue('123 45')

    await userEvent.type(phoneNumberInput, 'dfr2 gz6ij 2yw662 28jx6')
    await expect(phoneNumberInput).toHaveValue('262662286')
  })

  it('should remove unsupported characters and show the warning InfoBox for the address field', async () => {
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            unit: fakeUnit({ address: '' }),
          }),
          links: [fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE })],
        })
      )
    )
    renderComponent()

    const addressInput = screen.getByRole('textbox', { name: /postadress/i })
    await userEvent.type(addressInput, 'Gatan 1 😀')
    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()
  })

  it('should hide the warning InfoBox when the address field is cleared', async () => {
    store.dispatch(
      updateCertificate(
        fakeCertificate({
          metadata: fakeCertificateMetaData({
            unit: fakeUnit({ address: '' }),
          }),
          links: [fakeResourceLink({ type: ResourceLinkType.EDIT_CERTIFICATE })],
        })
      )
    )
    renderComponent()

    const addressInput = screen.getByRole('textbox', { name: /postadress/i })
    await userEvent.type(addressInput, 'Gatan 1 😀')
    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()

    await userEvent.clear(addressInput)
    expect(screen.queryByText(/Tecken som inte stöds/, { exact: false })).not.toBeInTheDocument()
  })
})
