import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
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

const CHECKBOX_LABEL = '25 procent'
const QUESTION_ID = 'EN_FJARDEDEL'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const renderDefaultComponent = (fromDate = null, toDate = null, baseWorkHours = '0') => {
  render(
    <DateRangePicker
      baseWorkHours={baseWorkHours}
      disabled={false}
      hasOverlap={false}
      hasValidationError={false}
      updateValue={() => {}}
      getPeriodStartingDate={() => formatDateToString(new Date())}
      label={CHECKBOX_LABEL}
      fromDate={fromDate}
      toDate={toDate}
      periodId={QUESTION_ID}
    />
  )
}

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

  it('shows invalid text validation error message', async () => {
    renderDefaultComponent()

    const fromInput = screen.getByLabelText('Fr.o.m')
    const tomInput = screen.getByLabelText('t.o.m')

    userEvent.type(fromInput, 'x{enter}')
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
    userEvent.clear(fromInput)
    fromInput.blur()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()

    userEvent.type(tomInput, 'x{enter}')
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
    userEvent.clear(tomInput)
    tomInput.blur()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })

  it('displays correct number of sick hours and days for one week', () => {
    renderDefaultComponent(undefined, undefined, '40')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1v{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka i 7 dagar.'))
  })

  it('displays correct number of sick hours and days for one month', () => {
    renderDefaultComponent(undefined, undefined, '40')

    userEvent.click(screen.getByRole('checkbox'))
    userEvent.type(screen.getByLabelText('t.o.m'), '1m{enter}')

    expect(screen.getByText('Arbetstid: 30 timmar/vecka i 31 dagar.')).toBeInTheDocument()
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
})
