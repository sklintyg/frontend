import { ValidationError } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useSelector } from 'react-redux'
import UeCareUnitAddress, {
  CARE_UNIT_ADDRESS_FIELD,
  CARE_UNIT_ZIP_CODE_FIELD,
  CARE_UNIT_CITY_FIELD,
  CARE_UNIT_PHONE_NUMBER_FIELD,
} from './UeCareUnitAddress'

const getValidationErrors = (): ValidationError[] => {
  const address: ValidationError = { id: '', category: '', field: CARE_UNIT_ADDRESS_FIELD, type: '', text: '' }
  const zipCode: ValidationError = { id: '', category: '', field: CARE_UNIT_ZIP_CODE_FIELD, type: '', text: '' }
  const city: ValidationError = { id: '', category: '', field: CARE_UNIT_CITY_FIELD, type: '', text: '' }
  const phoneNumber: ValidationError = { id: '', category: '', field: CARE_UNIT_PHONE_NUMBER_FIELD, type: '', text: '' }
  return [address, zipCode, city, phoneNumber]
}

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

const mockedUseSelector = useSelector as jest.Mock

describe('CareUnitAddress component', () => {
  beforeEach(() => {
    mockedUseSelector.mockImplementation((callback) => {
      return callback({ ui: { uiCertificate: {} } })
    })
  })

  afterEach(() => {
    mockedUseSelector.mockClear()
  })

  it('display all input fields with labels, mandatory and no validation errors', (): void => {
    const { container } = render(<UeCareUnitAddress />)

    expect(screen.getByRole('heading', { name: /vårdenhetens adress/i })).toBeInTheDocument()
    expect(screen.getByText(/postadress/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postadress/i })).toBeInTheDocument()
    expect(screen.getByText(/postnummer/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postnummer/i })).toBeInTheDocument()
    expect(screen.getByText(/postort/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /postort/i })).toBeInTheDocument()
    expect(screen.getByText(/telefonnummer/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toBeInTheDocument()
    expect(container.getElementsByClassName('ic-forms__error-message').length).toBe(0)
    expect(screen.queryAllByText(/\*/i)).toHaveLength(4)
  })

  it('display all validation errors', (): void => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        ui: {
          uiCertificate: {
            showValidationErrors: true,
            certificate: {
              metadata: {
                careUnitValidationErrors: getValidationErrors(),
              },
              links: [],
            },
          },
        },
      })
    )

    const { container } = render(<UeCareUnitAddress />)

    expect(container.getElementsByClassName('ic-forms__error-message').length).toBe(4)

    expect(screen.getByRole('textbox', { name: /postadress/i })).toHaveClass('ic-textarea--error')
    expect(screen.getByRole('textbox', { name: /postnummer/i })).toHaveClass('ic-textfield--error')
    expect(screen.getByRole('textbox', { name: /postort/i })).toHaveClass('ic-textfield--error')
    expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toHaveClass('ic-textfield--error')
  })

  it('display no validation errors', (): void => {
    const { container } = render(<UeCareUnitAddress />)

    expect(container.getElementsByClassName('ic-forms__error-message').length).toBe(0)
  })

  it('do not display mandatory', (): void => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        ui: {
          uiCertificate: {
            certificate: {
              metadata: {
                unit: {
                  unitId: 'unitId',
                  unitName: 'unitName',
                  address: 'address',
                  zipCode: '12345',
                  city: 'city',
                  phoneNumber: '123456789',
                  email: 'email',
                },
              },
              links: [],
            },
          },
        },
      })
    )

    render(<UeCareUnitAddress />)

    expect(screen.queryAllByText(/\*/i)).toHaveLength(0)
  })

  it('numeric inputs should only allow numbers', () => {
    mockedUseSelector.mockImplementation((callback) =>
      callback({
        ui: {
          uiCertificate: {
            certificate: {
              metadata: {},
              links: [{ type: 'EDIT_CERTIFICATE' }],
            },
          },
        },
      })
    )

    render(<UeCareUnitAddress />)

    const zipcodeInput = screen.getByRole('textbox', { name: /postnummer/i })
    const phoneNumberInput = screen.getByRole('textbox', { name: /telefonnummer/i })

    userEvent.type(zipcodeInput, '1a2b3c4d5e6f')
    expect(zipcodeInput).toHaveValue('123 45')

    userEvent.type(phoneNumberInput, 'dfr2 gz6ij 2yw662 28jx6')
    expect(phoneNumberInput).toHaveValue('262662286')
  })
})
