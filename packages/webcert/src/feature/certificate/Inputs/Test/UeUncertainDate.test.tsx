import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import UeUncertainDate from '../UeUncertainDate'
import userEvent from '@testing-library/user-event'

const YEARS = ['2020', '2021', '2022']
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const UNKNOWN_YEAR = true
const UNKNOWN_MONTH = true

const question: CertificateDataElement = {
  id: 'dropdown',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.UNCERTAIN_DATE },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_UNCERTAIN_DATE,
    allowedYears: YEARS,
    unknownYear: UNKNOWN_YEAR,
    unknownMonth: UNKNOWN_MONTH,
  },
}

const renderComponent = () => {
  render(
    <>
      <UeUncertainDate question={question} disabled={false}></UeUncertainDate>
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
  useSelectorSpy.mockReturnValue(jest.fn())
})

describe('Uncertain Date', () => {
  it('Renders element', () => {
    renderComponent()
  })

  it('renders control and all options', () => {
    renderComponent()
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).not.toBeDisabled()
    expect(yearDropdown).toBeInTheDocument()
    const yearOptions = yearDropdown.querySelectorAll('option')
    expect(yearOptions).toHaveLength(YEARS.length + (UNKNOWN_YEAR ? 2 : 1))

    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeDisabled()
    expect(monthDropdown).toBeInTheDocument()
    const monthOptions = monthDropdown.querySelectorAll('option')
    expect(monthOptions).toHaveLength(UNKNOWN_MONTH ? 14 : 13)

    const dayText = screen.getByLabelText('Dag')
    expect(dayText).toBeDisabled()
    expect(dayText).toBeInTheDocument()
  })

  it('lets user choose option', () => {
    renderComponent()
    const yearDropdown = screen.getByLabelText('År')
    const yearOptions = yearDropdown.querySelectorAll('option')
    const monthDropdown = screen.getByLabelText('Månad')
    const monthOptions = monthDropdown.querySelectorAll('option')
    expect(yearDropdown).toHaveValue('')
    expect(yearOptions[0].selected).toBeTruthy()
    expect(yearOptions[UNKNOWN_YEAR ? 2 : 1].selected).toBeFalsy()

    userEvent.click(yearDropdown)
    userEvent.selectOptions(yearDropdown, YEARS[0])
    expect(yearDropdown).toHaveValue(YEARS[0])
    expect(yearOptions[UNKNOWN_YEAR ? 2 : 1].selected).toBeTruthy()
    expect(yearOptions[0].selected).toBeFalsy()
    expect(monthDropdown).not.toBeDisabled()
    expect(monthDropdown).toHaveValue('')
    expect(monthOptions[0].selected).toBeTruthy()
    expect(monthOptions[UNKNOWN_MONTH ? 2 : 1].selected).toBeFalsy()

    userEvent.click(monthDropdown)
    userEvent.selectOptions(monthDropdown, MONTHS[0])
    expect(monthOptions[UNKNOWN_MONTH ? 2 : 1].selected).toBeTruthy()
    expect(monthOptions[0].selected).toBeFalsy()

    if (UNKNOWN_YEAR) {
      userEvent.click(yearDropdown)
      userEvent.selectOptions(yearDropdown, '0000')
      expect(yearDropdown).toHaveValue('0000')
      expect(yearOptions[UNKNOWN_YEAR ? 1 : 0].selected).toBeTruthy()
      expect(yearOptions[0].selected).toBeFalsy()
      expect(monthDropdown).toBeDisabled()
      expect(monthDropdown).toHaveValue(UNKNOWN_MONTH ? '00' : '')
      expect(monthOptions[UNKNOWN_MONTH ? 1 : 0].selected).toBeTruthy()
      expect(monthOptions[UNKNOWN_MONTH ? 2 : 1].selected).toBeFalsy()
    }
  })

  it('gets disabled correctly', () => {
    render(
      <>
        <UeUncertainDate question={question} disabled={true}></UeUncertainDate>
      </>
    )
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).toBeDisabled()
    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeDisabled()
  })
})
