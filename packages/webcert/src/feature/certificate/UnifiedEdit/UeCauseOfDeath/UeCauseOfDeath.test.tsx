import { fakeCauseOfDeathElement } from '@frontend/common'
import { CertificateDataElement, CertificateDataValidationType } from '@frontend/common/src/types/certificate'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import _ from 'lodash'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCauseOfDeath from './UeCauseOfDeath'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'causeOfDeath'

const question: CertificateDataElement = fakeCauseOfDeathElement({
  id: QUESTION_ID,
  validation: [
    {
      type: CertificateDataValidationType.MANDATORY_VALIDATION,
      questionId: 'checkbox',
      expression: `$undersokningAvPatienten`,
    },
  ],
  validationErrors: [{ category: 'category', field: '', text: VALIDATION_ERROR, id: QUESTION_ID, type: 'type' }],
})[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeCauseOfDeath>) => {
  render(
    <Provider store={store}>
      <UeCauseOfDeath {...props} />
    </Provider>
  )
}

describe('Cause of death component', () => {
  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getByLabelText('Beskrivning')).toBeInTheDocument()
    expect(screen.getByLabelText('Ungefärlig debut')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent({
      disabled: false,

      question: _.merge(question, {
        value: {
          description: { text: 'description' },
          debut: { date: '2020-02-02' },
          specification: { code: 'KRONISK' },
        },
      }),
    })
    const dropdown = screen.getByRole('combobox')
    expect(screen.getByLabelText('Beskrivning')).toHaveValue('description')
    expect(screen.getByLabelText('Ungefärlig debut')).toHaveValue('2020-02-02')
    expect(dropdown).toHaveValue('KRONISK')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).not.toBeDisabled()
    expect(screen.getByLabelText('Beskrivning')).not.toBeDisabled()
    expect(screen.getByLabelText('Ungefärlig debut')).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const dropdown = screen.getByRole('combobox')
    expect(dropdown).toBeDisabled()
    expect(screen.getByLabelText('Beskrivning')).toBeDisabled()
    expect(screen.getByLabelText('Ungefärlig debut')).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent({ disabled: false, question })

    const inputDate = '20200202'
    const expected = '2020-02-02'
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, inputDate)
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, '2020-01')
    userEvent.tab()
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument(), 100)
  })

  it('should display error when input is not a valid date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, 'test')
    userEvent.tab()
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument(), 100)
  })

  it('should not display error when input is a valid date', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByLabelText('Ungefärlig debut')
    userEvent.type(input, '20200101')
    userEvent.tab()
    setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument(), 100)
  })
})
