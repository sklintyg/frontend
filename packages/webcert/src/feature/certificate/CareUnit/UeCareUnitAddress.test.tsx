import { ValidationError } from '@frontend/common'
import {
  CARE_UNIT_ADDRESS_FIELD,
  CARE_UNIT_CITY_FIELD,
  CARE_UNIT_PHONE_NUMBER_FIELD,
  CARE_UNIT_ZIP_CODE_FIELD,
} from '@frontend/common/src/utils/validationUtils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import * as redux from 'react-redux'
import UeCareUnitAddress from './UeCareUnitAddress'

const getValidationErrors = (): ValidationError[] => {
  const address: ValidationError = { id: '', category: '', field: CARE_UNIT_ADDRESS_FIELD, type: '', text: '' }
  const zipCode: ValidationError = { id: '', category: '', field: CARE_UNIT_ZIP_CODE_FIELD, type: '', text: '' }
  const city: ValidationError = { id: '', category: '', field: CARE_UNIT_CITY_FIELD, type: '', text: '' }
  const phoneNumber: ValidationError = { id: '', category: '', field: CARE_UNIT_PHONE_NUMBER_FIELD, type: '', text: '' }
  return [address, zipCode, city, phoneNumber]
}

describe('CareUnitAddress component', () => {
  it('display all input fields with labels, mandatory and no validation errors', (): void => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(jest.fn())
    useSelectorSpy.mockReturnValueOnce(false)
    useSelectorSpy.mockReturnValueOnce([])
    useSelectorSpy.mockReturnValue({})

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
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(jest.fn())
    useSelectorSpy.mockReturnValueOnce(true)
    useSelectorSpy.mockReturnValueOnce(getValidationErrors())
    useSelectorSpy.mockReturnValue({})

    const { container } = render(<UeCareUnitAddress />)

    expect(container.getElementsByClassName('ic-forms__error-message').length).toBe(4)

    expect(screen.getByRole('textbox', { name: /postadress/i })).toHaveClass('ic-textarea--error')
    expect(screen.getByRole('textbox', { name: /postnummer/i })).toHaveClass('ic-textfield--error')
    expect(screen.getByRole('textbox', { name: /postort/i })).toHaveClass('ic-textfield--error')
    expect(screen.getByRole('textbox', { name: /telefonnummer/i })).toHaveClass('ic-textfield--error')
  })

  it('display no validation errors', (): void => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(jest.fn())
    useSelectorSpy.mockReturnValueOnce(true)
    useSelectorSpy.mockReturnValueOnce([])
    useSelectorSpy.mockReturnValue({})

    const { container } = render(<UeCareUnitAddress />)

    expect(container.getElementsByClassName('ic-forms__error-message').length).toBe(0)
  })

  it('do not display mandatory', (): void => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(jest.fn())
    useSelectorSpy.mockReturnValueOnce(false)
    useSelectorSpy.mockReturnValueOnce([])
    useSelectorSpy.mockReturnValueOnce({
      unitId: 'unitId',
      unitName: 'unitName',
      address: 'address',
      zipCode: 'zipCode',
      city: 'city',
      phoneNumber: 'phoneNumber',
      email: 'email',
    })
    useSelectorSpy.mockReturnValue({})

    render(<UeCareUnitAddress />)

    expect(screen.queryAllByText(/\*/i)).toHaveLength(0)
  })

  it('numeric inputs should only allow numbers', async () => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector')
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(jest.fn())
    useSelectorSpy.mockImplementation((callback) =>
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

    await userEvent.type(zipcodeInput, '1a2b3c4d5e6f')
    expect(zipcodeInput).toHaveValue('123 45')

    await userEvent.type(phoneNumberInput, 'dfr2 gz6ij 2yw662 28jx6')
    expect(phoneNumberInput).toHaveValue('262662286')
  })
})
