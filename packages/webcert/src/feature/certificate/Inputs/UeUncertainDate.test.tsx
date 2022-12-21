import React, { ComponentProps } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UeUncertainDate from './UeUncertainDate'
import userEvent from '@testing-library/user-event'
import { EnhancedStore, configureStore } from '@reduxjs/toolkit'
import reducer from '../../../store/reducers'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { fakeCertificate, fakeUncertainDateElement } from '@frontend/common'
import { Provider } from 'react-redux'

const YEARS = ['2020', '2021', '2022']
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

let testStore: EnhancedStore

const question = fakeUncertainDateElement({
  id: '1',
  config: {
    allowedYears: YEARS,
    unknownYear: true,
    unknownMonth: true,
  },
  value: {
    value: null,
  },
})['1']

const renderComponent = (props: ComponentProps<typeof UeUncertainDate>) => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          [props.question.id]: props.question,
        },
      })
    )
  )
  render(
    <Provider store={testStore}>
      <UeUncertainDate {...props} />
    </Provider>
  )
}

describe('UeUncertainDate', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
  })

  it('Renders element', () => {
    renderComponent({ question })
  })

  it('renders control and all options', () => {
    renderComponent({ question })
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).toBeInTheDocument()
    expect(yearDropdown).not.toBeDisabled()
    const yearOptions = yearDropdown.querySelectorAll('option')
    expect(yearOptions).toHaveLength(YEARS.length + 2)

    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeInTheDocument()
    expect(monthDropdown).toBeDisabled()
    const monthOptions = monthDropdown.querySelectorAll('option')
    expect(monthOptions).toHaveLength(14)

    const dayText = screen.getByLabelText('Dag')
    expect(dayText).toBeInTheDocument()
    expect(dayText).toBeDisabled()
  })

  it('lets user choose option', () => {
    renderComponent({ question })
    const yearDropdown = screen.getByLabelText('År')
    const yearOptions = yearDropdown.querySelectorAll('option')
    const monthDropdown = screen.getByLabelText('Månad')
    const monthOptions = monthDropdown.querySelectorAll('option')
    expect(yearDropdown).toHaveValue('')
    expect(yearOptions[0].selected).toBeTruthy()
    expect(yearOptions[2].selected).toBeFalsy()

    userEvent.click(yearDropdown)
    userEvent.selectOptions(yearDropdown, YEARS[0])
    expect(yearDropdown).toHaveValue(YEARS[0])
    expect(yearOptions[2].selected).toBeTruthy()
    expect(yearOptions[0].selected).toBeFalsy()
    expect(monthDropdown).not.toBeDisabled()
    expect(monthDropdown).toHaveValue('')
    expect(monthOptions[0].selected).toBeTruthy()
    expect(monthOptions[2].selected).toBeFalsy()

    userEvent.click(monthDropdown)
    userEvent.selectOptions(monthDropdown, MONTHS[0])
    expect(monthOptions[2].selected).toBeTruthy()
    expect(monthOptions[0].selected).toBeFalsy()

    userEvent.click(yearDropdown)
    userEvent.selectOptions(yearDropdown, '0000')
    expect(yearDropdown).toHaveValue('0000')
    expect(yearOptions[1].selected).toBeTruthy()
    expect(yearOptions[0].selected).toBeFalsy()
    expect(monthDropdown).toBeDisabled()
    expect(monthDropdown).toHaveValue('00')
    expect(monthOptions[1].selected).toBeTruthy()
    expect(monthOptions[0].selected).toBeFalsy()
  })

  it('gets disabled correctly', () => {
    renderComponent({ question, disabled: true })
    const yearDropdown = screen.getByLabelText('År')
    expect(yearDropdown).toBeDisabled()
    const monthDropdown = screen.getByLabelText('Månad')
    expect(monthDropdown).toBeDisabled()
  })
})
