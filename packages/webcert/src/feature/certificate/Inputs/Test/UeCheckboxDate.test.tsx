import React from 'react'
import '@testing-library/jest-dom'
import { format } from 'date-fns'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
} from '@frontend/common/src/types/certificate'
import UeCheckboxDate from '../UeCheckboxDate'
import { Provider } from 'react-redux'
import store from '../../../../store/store'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const _format = 'yyyy-MM-dd'
const DATE_CHECKBOX = {
  id: 'undersokningAvPatienten',
  label: 'min undersökning av patienten',
}

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'checkbox'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  value: { type: CertificateDataValueType.DATE },
  config: {
    text: '',
    id: DATE_CHECKBOX.id,
    label: DATE_CHECKBOX.label,
    description: '',
    type: ConfigTypes.UE_CHECKBOX_DATE,
  },
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: 'checkbox',
      expression: `$undersokningAvPatienten`,
    },
  ],
  validationErrors: [{ category: 'category', field: '', text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
}

const renderComponent = (disabled: boolean, hasValidationError: boolean) => {
  render(
    <>
      <Provider store={store}>
        <UeCheckboxDate
          question={question}
          disabled={disabled}
          id={DATE_CHECKBOX.id}
          hasValidationError={hasValidationError}
          label={DATE_CHECKBOX.label}
          date={''}
        />
      </Provider>
    </>
  )
}

describe('CheckboxDate component', () => {
  it('renders without crashing', () => {
    renderComponent(false, false)
  })

  it('renders checkbox, textinput and calendar button', () => {
    renderComponent(false, false)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent(false, false)
    const checkbox = screen.getByRole('checkbox')
    const input = screen.getByRole('textbox')
    expect(checkbox).not.toBeChecked()
    expect(input).toHaveValue('')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent(false, false)
    const checkbox = screen.getByRole('checkbox')
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(checkbox).not.toBeDisabled()
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent(true, false)
    const checkbox = screen.getByRole('checkbox')
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(checkbox).toBeDisabled()
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('checks checkbox and sets date when user clicks on checkbox', () => {
    renderComponent(false, false)
    const checkbox = screen.getByRole('checkbox')
    const textbox = screen.getByRole('textbox')
    userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(textbox).toHaveValue(format(new Date(), _format))
  })

  it('checks checkbox and sets date when user clicks on label', () => {
    renderComponent(false, false)
    const checkbox = screen.getByRole('checkbox')
    const textbox = screen.getByRole('textbox')
    const label = screen.getByText(DATE_CHECKBOX.label)
    userEvent.click(label)
    expect(checkbox).toBeChecked()
    expect(textbox).toHaveValue(format(new Date(), _format))
  })

  it('checks checkbox if user writes date', () => {
    renderComponent(false, false)
    const inputString = 'Hello!'
    const checkbox = screen.getByRole('checkbox')
    const input = screen.getByRole('textbox')

    userEvent.type(input, inputString)
    expect(checkbox).toBeChecked()
    expect(input).toHaveValue(inputString)
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent(false, false)

    const inputDate = '20200202'
    const expected = '2020-02-02'
    const checkbox = screen.getByRole('checkbox')
    const input = screen.getByRole('textbox')

    userEvent.type(input, inputDate)
    expect(checkbox).toBeChecked()
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent(false, false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, '2020-01')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, 'test')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should not display error when input is a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, '20200101')
    userEvent.tab()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })
})
