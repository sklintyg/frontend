import { fakeCertificateValue, formatDateToString, getValidDate, ValueDateRange } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { differenceInCalendarDays } from 'date-fns'
import React, { ComponentProps, useState } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import DateRangePicker from './DateRangePicker'

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
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('Fr.o.m has a valid value after checkbox is clicked', async () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    expect((screen.getByLabelText('Fr.o.m') as HTMLInputElement).value).toBeTruthy()
  })

  it('Calculates 1 day with 1d/d1', async () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    await userEvent.type(toDateTextInput, '1d{enter}')
    const toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(getValidDate(toDateString)).toBeTruthy()

    const differenceInDays = differenceInCalendarDays(new Date(toDateString), new Date(fromDateString))

    expect(differenceInDays).toBe(0)
    expect(toDateString).toEqual(fromDateString)
  })

  it('Calculates 1 week ahead with 1v/v1', async () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    await userEvent.type(toDateTextInput, '1v{enter}')
    const toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(getValidDate(toDateString)).toBeTruthy()

    const differenceInDays = differenceInCalendarDays(new Date(toDateString), new Date(fromDateString))

    expect(differenceInDays).toBe(6)
  })

  it('Calculates 1 month ahead with 1m/m1', async () => {
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    const fromDateString = (screen.getByLabelText('Fr.o.m') as HTMLInputElement).value

    const toDateTextInput = screen.getByLabelText('t.o.m')
    await userEvent.type(toDateTextInput, '1m{enter}')
    const toDateString = (screen.getByLabelText('t.o.m') as HTMLInputElement).value

    expect(toDateString).toBeTruthy()
    const differenceInDays = differenceInCalendarDays(new Date(toDateString), new Date(fromDateString))

    expect(differenceInDays).toBe(30)
  })

  it('displays correct number of sick hours and days for one week', async () => {
    renderDefaultComponent(undefined, undefined, '40')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka')).toBeInTheDocument()
    expect(screen.getByText('i 7 dagar.', { exact: false })).toBeInTheDocument()
  })

  it('displays correct number of sick hours and days for one month', async () => {
    renderDefaultComponent(undefined, undefined, '40')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka')).toBeInTheDocument()
    expect(screen.getByText('i 31 dagar', { exact: false })).toBeInTheDocument()
  })

  it('displays no sick hours/days when missing base work hours', async () => {
    renderDefaultComponent(undefined, undefined, '')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(screen.queryByText('Arbetstid:')).not.toBeInTheDocument()
  })

  it('displays no sick hours/days when missing period dates', () => {
    renderDefaultComponent(undefined, undefined, '40')
    expect(screen.queryByText('Arbetstid:')).not.toBeInTheDocument()
  })

  it('displays no sick hours when value is cleared', async () => {
    renderDefaultComponent(undefined, undefined, '0')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(screen.queryByText('Arbetstid:', { exact: false })).not.toBeInTheDocument()
  })
})
