/* eslint-disable react/function-component-definition */
import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificateValue } from '../../../../faker'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import type { ValueDateRange } from '../../../../types'
import { formatDateToString } from '../../../../utils'
import { UeCheckboxDateRangeListField } from './UeCheckboxDateRangeListField'

let testStore: EnhancedStore

const DateRangePickerWrapper = ({ value, ...props }: Omit<ComponentProps<typeof UeCheckboxDateRangeListField>, 'onChange'>) => {
  const [val, setValue] = useState<ValueDateRange>(value)

  return <UeCheckboxDateRangeListField onChange={setValue} value={val} {...props} />
}

const renderDefaultComponent = (fromDate = undefined, toDate = undefined, baseWorkHours = '0') => {
  render(
    <Provider store={testStore}>
      <DateRangePickerWrapper
        baseWorkHours={baseWorkHours}
        disabled={false}
        field="EN_FJARDEDEL"
        periodStartingDate={formatDateToString(new Date())}
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
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    await userEvent.type(screen.getByLabelText('t.o.m'), '1d{enter}')
    await expect(screen.getByLabelText('Fr.o.m')).toHaveValue('2000-02-01')
    await expect(screen.getByLabelText('t.o.m')).toHaveValue('2000-02-01')
  })

  it('Calculates 1 week ahead with 1v/v1', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    await userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')
    await expect(screen.getByLabelText('Fr.o.m')).toHaveValue('2000-02-01')
    await expect(screen.getByLabelText('t.o.m')).toHaveValue('2000-02-07')
  })

  it('Calculates 1 month ahead with 1m/m1', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))
    renderDefaultComponent()

    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    await userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')
    await expect(screen.getByLabelText('Fr.o.m')).toHaveValue('2000-02-01')
    await expect(screen.getByLabelText('t.o.m')).toHaveValue('2000-03-02')
  })

  it('displays correct number of sick hours and days for one week', async () => {
    renderDefaultComponent(undefined, undefined, '40')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(await screen.findByText('Arbetstid: 30 timmar/vecka')).toBeInTheDocument()
    expect(screen.getByText('i 7 dagar.', { exact: false })).toBeInTheDocument()
  })

  it('displays correct number of sick hours and days for one month', async () => {
    renderDefaultComponent(undefined, undefined, '40')

    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(await screen.findByText('Arbetstid: 30 timmar/vecka')).toBeInTheDocument()
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
