import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigTypes,
} from '@frontend/common/src/types/certificate'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCauseOfDeath from './UeCauseOfDeath'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const CAUSE_OF_DEATH = {
  id: 'termainalDodsorsak',
  label: 'A',
  title: 'Den terminala dödsorsaken',
  specifications: [
    { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
    { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
    { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
  ],
}

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'causeOfDeath'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  config: {
    type: ConfigTypes.UE_CAUSE_OF_DEATH,
    text: 'Den terminala dödsorsaken var',
    description: 'Den diagnos eller det tillstånd som ledde till den terminala dödsorsaken',
    label: 'A',
    causeOfDeath: {
      id: 'termainalDodsorsak',
      descriptionId: 'description',
      debutId: 'debut',
      specifications: CAUSE_OF_DEATH.specifications,
    },
  },
  value: {
    type: CertificateDataValueType.CAUSE_OF_DEATH,
    description: {
      type: CertificateDataValueType.TEXT,
      id: 'description',
    },
    debut: {
      type: CertificateDataValueType.DATE,
      id: 'debut',
    },
    specification: {
      type: CertificateDataValueType.CODE,
    },
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
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument(), 100)
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, 'test')
    userEvent.tab()
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument(), 100)
  })

  it('should not display error when input is a valid date', () => {
    renderComponent(false, false)
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, '20200101')
    userEvent.tab()
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument(), 100)
  })
})
