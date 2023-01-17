import { fakeCauseOfDeathListElement } from '@frontend/common'
import {
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  Value,
  ValueCode,
  ValueDate,
  ValueText,
} from '@frontend/common/src/types/certificate'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCauseOfDeathList from './UeCauseOfDeathList'

const DESCRIPTION_LABEL = 'Beskrivning'
const DEBUT_LABEL = 'Ungefärlig debut'
const SPECIFICATION_LABEL = 'Specificera tillståndet'
const ADD_BUTTON_TEXT = 'Lägg till sjukdom/skada'
const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'
const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'list'

const question: CertificateDataElement = fakeCauseOfDeathListElement({
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

const renderComponent = (props: ComponentProps<typeof UeCauseOfDeathList>) => {
  render(
    <Provider store={store}>
      <UeCauseOfDeathList {...props} />
    </Provider>
  )
}

describe('Cause of death component', () => {
  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })

  it('renders all components', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(1)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(1)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(1)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).toBeInTheDocument()
    })
    specifications.forEach((specification) => {
      expect(specification).toBeInTheDocument()
    })
    dates.forEach((date) => {
      expect(date).toBeInTheDocument()
    })
  })

  it('renders component with correct default values', () => {
    const description: ValueText = { type: CertificateDataValueType.TEXT, id: '1', text: 'Description text' }
    const debut: ValueDate = { type: CertificateDataValueType.DATE, id: '1', date: '2020-02-20' }
    const specification: ValueCode = { type: CertificateDataValueType.CODE, id: '1', code: '' }

    renderComponent({
      disabled: false,
      question: {
        ...question,
        value: {
          ...(question.value as Value),
          list: [
            {
              description,
              debut,
              specification,
            },
          ],
        },
      },
    })

    expect(screen.getAllByLabelText(DEBUT_LABEL)[0]).toHaveValue('2020-02-20')
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)[0]).toHaveValue('Description text')
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)[0]).toHaveValue('')
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).not.toBeDisabled()
    })
    specifications.forEach((specification) => {
      expect(specification).not.toBeDisabled()
    })
    dates.forEach((date) => {
      expect(date).not.toBeDisabled()
    })
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled()
    })
  })

  it('Disable component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const descriptions = screen.getAllByLabelText(DESCRIPTION_LABEL)
    const specifications = screen.getAllByLabelText(SPECIFICATION_LABEL)
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    descriptions.forEach((description) => {
      expect(description).toBeDisabled()
    })
    specifications.forEach((specification) => {
      expect(specification).toBeDisabled()
    })
    dates.forEach((date) => {
      expect(date).toBeDisabled()
    })
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    const inputDate = '20200202'
    const expected = '2020-02-02'
    dates.forEach((date) => {
      userEvent.clear(date)
      userEvent.type(date, inputDate)
      expect(date).toHaveValue(expected)
    })
  })

  it('should display error when input is not a complete date', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    dates.forEach((date) => {
      userEvent.type(date, '2020-01')
      userEvent.tab()
      setTimeout(() => {
        const error = screen.getByText(INVALID_DATE_MESSAGE)
        expect(error).toBeInTheDocument()
        userEvent.clear(date)
        userEvent.tab()
        setTimeout(() => expect(error).not.toBeInTheDocument(), 100)
      }, 100)
    })
  })

  it('should display error when input is not a valid date', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    dates.forEach((date) => {
      userEvent.type(date, 'test')
      userEvent.tab()
      setTimeout(() => {
        const error = screen.getByText(INVALID_DATE_MESSAGE)
        expect(error).toBeInTheDocument()
        userEvent.clear(date)
        userEvent.tab()
        setTimeout(() => expect(error).not.toBeInTheDocument(), 100)
      }, 100)
    })
  })

  it('should not display error when input is a valid date', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText(DEBUT_LABEL)
    dates.forEach((date) => {
      userEvent.type(date, '20200101')
      userEvent.tab()
      setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument(), 100)
      userEvent.clear(date)
      userEvent.tab()
    })
  })

  it('should add new row when button is clicked', () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText(ADD_BUTTON_TEXT)
    userEvent.click(button)
    expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(2)
    expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(2)
    expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(2)
  })

  it('should not add more than 7 rows', () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText(ADD_BUTTON_TEXT)
    userEvent.click(button)
    setTimeout(() => {
      userEvent.click(button)
      setTimeout(() => userEvent.click(button), 100)
      setTimeout(() => userEvent.click(button), 100)
      setTimeout(() => userEvent.click(button), 100)
      setTimeout(() => userEvent.click(button), 100)
      expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(7)
      expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(7)
      expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(7)
      expect(button).not.toBeDisabled()
      setTimeout(() => userEvent.click(button), 100)
      expect(screen.getAllByLabelText(DESCRIPTION_LABEL)).toHaveLength(8)
      expect(screen.getAllByLabelText(DEBUT_LABEL)).toHaveLength(8)
      expect(screen.getAllByLabelText(SPECIFICATION_LABEL)).toHaveLength(8)
      expect(button).toBeDisabled()
    }, 100)
  })
})
