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
import UeCauseOfDeath from './UeCauseOfDeath'
import { Provider } from 'react-redux'
import store from '../../../../store/store'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const CAUSE_OF_DEATH = {
  id: 'termainalDodsorsak',
  label: 'A',
  title: 'Den terminala dödsorsaken',
  specifications: [
    { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
    { id: 'KRONISK', label: 'Kronisk' },
    { id: 'PLOTSLIG', label: 'Plötslig' },
  ],
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
  value: { type: CertificateDataValueType.CAUSE_OF_DEATH },
  config: {
    text: '',
    id: CAUSE_OF_DEATH.id,
    label: CAUSE_OF_DEATH.label,
    title: CAUSE_OF_DEATH.title,
    specifications: CAUSE_OF_DEATH.specifications,
    description: '',
    type: ConfigTypes.UE_CAUSE_OF_DEATH,
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
        <UeCauseOfDeath question={question} disabled={disabled} hasValidationError={hasValidationError} />
      </Provider>
    </>
  )
}

describe('Cause of death component', () => {
  it('renders without crashing', () => {
    renderComponent(false, false)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent(false, false)
    expect(screen.getByLabelText('Beskrivning')).toBeInTheDocument()
    expect(screen.getByLabelText('Ungefärlig debut')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent(false, false)
    const dropdown = screen.getByRole('combobox')
    expect(screen.getByLabelText('Beskrivning')).toHaveValue('')
    expect(screen.getByLabelText('Ungefärlig debut')).toHaveValue('')
    expect(dropdown).toHaveValue('')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent(false, false)
    const dropdown = screen.getByRole('combobox')
    const button = screen.getByRole('button')
    expect(dropdown).not.toBeDisabled()
    expect(screen.getByLabelText('Beskrivning')).not.toBeDisabled()
    expect(screen.getByLabelText('Ungefärlig debut')).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent(true, false)
    const dropdown = screen.getByRole('combobox')
    const button = screen.getByRole('button')
    expect(dropdown).toBeDisabled()
    expect(screen.getByLabelText('Beskrivning')).toBeDisabled()
    expect(screen.getByLabelText('Ungefärlig debut')).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent(false, false)

    const inputDate = '20200202'
    const expected = '2020-02-02'
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, inputDate)
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent(false, false)
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, '2020-01')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, 'test')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should not display error when input is a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, '20200101')
    userEvent.tab()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })
})
