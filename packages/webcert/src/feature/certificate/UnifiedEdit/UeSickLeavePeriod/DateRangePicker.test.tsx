import React, { ComponentProps, useState } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getValidDate, ValueDateRange, formatDateToString } from '@frontend/common'
import DateRangePicker from './DateRangePicker'
import { differenceInCalendarDays, isEqual } from 'date-fns'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { EnhancedStore, configureStore } from '@reduxjs/toolkit'
import reducers from '../../../../store/reducers'
import { Provider } from 'react-redux'
import { fakeCertificateValue } from '@frontend/common/src/utils/faker/fakeCertificateValue'

let testStore: EnhancedStore

const DateRangePickerWrapper: React.FC<Omit<ComponentProps<typeof DateRangePicker>, 'onChange'>> = ({ value, ...props }) => {
  const [val, setValue] = useState<ValueDateRange>(value)

  return (
    <DateRangePicker
      onChange={(val) => {
        setValue(val)
      }}
      value={val}
      {...props}
    />
  )
}

const renderDefaultComponent = (fromDate = undefined, toDate = undefined, baseWorkHours = '0') => {
  render(
    <Provider store={testStore}>
      <DateRangePickerWrapper
        baseWorkHours={baseWorkHours}
        disabled={false}
        field="EN_FJARDEDEL"
        getPeriodStartingDate={() => formatDateToString(new Date())}
        label="25 procent"
        value={fakeCertificateValue.dateRange({ from: fromDate, to: toDate })}
        validationErrors={[]}
        hasValidationError={false}
      />
    </Provider>
  )
}

describe('Date range picker', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: reducers,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
  })

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

  it('displays correct number of sick hours and days for one week', () => {
    renderDefaultComponent(undefined, undefined, '40')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka'))
    expect(screen.getByText('i 7 dagar.', { exact: false }))
  })

  it('displays correct number of sick hours and days for one month', () => {
    renderDefaultComponent(undefined, undefined, '40')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka')).toBeInTheDocument()
    expect(screen.getByText('i 31 dagar', { exact: false })).toBeInTheDocument()
  })

  it('displays no sick hours/days when missing base work hours', () => {
    renderDefaultComponent(undefined, undefined, '')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(screen.queryByText('Arbetstid:')).not.toBeInTheDocument()
  })

  it('displays no sick hours/days when missing period dates', () => {
    renderDefaultComponent(undefined, undefined, '40')
    expect(screen.queryByText('Arbetstid:')).not.toBeInTheDocument()
  })

  it('displays no sick hours when value is cleared', () => {
    renderDefaultComponent(undefined, undefined, '0')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(screen.queryByText('Arbetstid:', { exact: false })).not.toBeInTheDocument()
  })
})
