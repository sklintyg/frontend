import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
} from '@frontend/common/src/types/certificate'
import UeDatePicker from '../UeDatePicker'
import { Provider } from 'react-redux'
import store from '../../../../store/store'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'datepicker'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: false,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  value: { type: CertificateDataValueType.DATE },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_DATEPICKER,
  },
  validation: [
    {
      type: CertificateDataValidationType.MAX_DATE_VALIDATION,
      questionId: QUESTION_ID,
      expression: `$datum`,
    },
  ],
  validationErrors: [{ category: 'category', field: '', text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
}

const renderComponent = (disabled: boolean) => {
  render(
    <>
      <Provider store={store}>
        <UeDatePicker question={question} disabled={disabled} />
      </Provider>
    </>
  )
}

describe('DatePicker component', () => {
  it('renders without crashing', () => {
    renderComponent(false)
  })

  it('renders textinput and calendar button', () => {
    renderComponent(false)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent(true)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent(false)

    const inputDate = '20200202'
    const expected = '2020-02-02'
    const input = screen.getByRole('textbox')

    userEvent.type(input, inputDate)
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, '2020-01')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, 'test')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should not display error when input is a valid date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, '20200101')
    userEvent.tab()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })
})
