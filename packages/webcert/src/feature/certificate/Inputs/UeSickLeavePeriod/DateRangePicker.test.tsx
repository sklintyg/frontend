import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
  formatDateToString,
  getValidDate,
} from '@frontend/common'
import DateRangePicker from './DateRangePicker'
import * as redux from 'react-redux'
import { differenceInCalendarDays, isEqual } from 'date-fns'

const LABEL = '25 procent'
const QUESTION_ID = 'Test'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  parent: 'bedomning',
  index: 18,
  visible: true,
  readOnly: false,
  mandatory: true,
  config: {
    text: 'Min bedömning av patientens nedsättning av arbetsförmågan',
    description: 'Utgångspunkten är att patientens arbetsförmåga ska bedömas i förhållande till hens normala arbetstid.',
    type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
    list: [
      {
        id: 'EN_FJARDEDEL',
        label: '25 procent',
      },
      {
        id: 'HALFTEN',
        label: '50 procent',
      },
      {
        id: 'TRE_FJARDEDEL',
        label: '75 procent',
      },
      {
        id: 'HELT_NEDSATT',
        label: '100 procent',
      },
    ],
  },
  value: {
    type: CertificateDataValueType.DATE_RANGE_LIST,
    list: [],
  },
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: '32',
      expression: '$EN_FJARDEDEL || $HALFTEN || $TRE_FJARDEDEL || $HELT_NEDSATT',
    },
  ],
  validationError: [],
}

const renderDefaultComponent = (fromDate = null, toDate = null) => {
  render(
    <DateRangePicker
      updateValue={() => {}}
      getPeriodStartingDate={() => formatDateToString(new Date())}
      label={LABEL}
      fromDate={fromDate}
      toDate={toDate}
      periodId={QUESTION_ID}
    />
  )
}

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
useDispatchSpy.mockReturnValue(jest.fn())
useSelectorSpy.mockReturnValue(jest.fn())

describe('Date range picker', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('Fr.o.m has a valid value after checkbox is clicked', () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    userEvent.click(checkbox)

    expect((screen.getByLabelText('Fr.o.m') as HTMLInputElement).value).toBeTruthy()
  })

  it('Calculates 1 day with 1d/d1', () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    userEvent.type(toDateTextInput, '1d{enter}')
    let toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(getValidDate(toDateString)).toBeTruthy()

    const fromDate = getValidDate(fromDateString)
    let toDate = getValidDate(toDateString)
    let differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(0)
    expect(isEqual(fromDate!, toDate!)).toBeTruthy()

    userEvent.clear(toDateTextInput)
    userEvent.type(toDateTextInput, 'd1{enter}')
    toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value
    toDate = getValidDate(toDateString)
    differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(0)
    expect(isEqual(fromDate!, toDate!)).toBeTruthy()
  })

  it('Calculates 1 week ahead with 1v/v1', () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    userEvent.type(toDateTextInput, '1v{enter}')
    let toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(getValidDate(toDateString)).toBeTruthy()

    const fromDate = getValidDate(fromDateString)
    let toDate = getValidDate(toDateString)
    let differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(6)

    userEvent.clear(toDateTextInput)
    userEvent.type(toDateTextInput, 'v1{enter}')
    toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value
    toDate = getValidDate(toDateString)
    differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(6)
  })

  it('Calculates 1 month ahead with 1m/m1', () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    userEvent.type(toDateTextInput, '1m{enter}')
    let toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(toDateString).toBeTruthy()

    const fromDate = getValidDate(fromDateString)
    let toDate = getValidDate(toDateString)
    let differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(30)

    userEvent.clear(toDateTextInput)
    userEvent.type(toDateTextInput, 'm1{enter}')
    toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value
    toDate = getValidDate(toDateString)
    differenceInDays = differenceInCalendarDays(toDate!, fromDate!)

    expect(differenceInDays).toBe(30)
  })
})
