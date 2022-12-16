import { fakeDateElement, fakeCertificate } from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import reducer from '../../../../store/reducers'
import UeDate from '../UeDate'
import { getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'

let testStore: EnhancedStore
const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'
const VALIDATION_ERROR = 'Ange ett datum, samma som eller tidigare än "Dödsdatum".'
const QUESTION_ID = 'datepicker'

const question = fakeDateElement({ id: QUESTION_ID, value: { date: '2022-09-29' } })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeDate>) => {
  render(
    <>
      <Provider store={testStore}>
        <UeDate {...props} />
      </Provider>
    </>
  )
}

describe('DatePicker component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })

  it('renders textinput and calendar button', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent({ disabled: false, question })

    const inputDate = '20220929'
    const expected = '2022-09-29'
    const input = screen.getByRole('textbox')

    userEvent.type(input, inputDate)
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, '2020-01')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should display error when input is not a valid date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'test')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should not display error when input is a valid date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    userEvent.type(input, '20200101')
    userEvent.tab()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toHaveValue('2022-09-29')
    expect(button).toHaveValue('2022-09-29')
  })

  it('should display server validation errors on question.config.id (field)', () => {
    const question = fakeDateElement({
      config: { id: 'field' },
      id: QUESTION_ID,
      validationErrors: [
        {
          field: 'field',
          id: QUESTION_ID,
          text: VALIDATION_ERROR,
        },
      ],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
    renderComponent({ disabled: false, question })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).toBeNull()

    testStore.dispatch(showValidationErrors())
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })

  it('should display server validation errors on question.id', () => {
    const question = fakeDateElement({
      id: QUESTION_ID,
      validationErrors: [{ text: VALIDATION_ERROR }],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
    renderComponent({ disabled: false, question })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).toBeNull()

    testStore.dispatch(showValidationErrors())
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })
})
