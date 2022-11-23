import { fakeCauseOfDeathListElement } from '@frontend/common'
import { CertificateDataElement, CertificateDataValidationType } from '@frontend/common/src/types/certificate'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeCauseOfDeathList from './UeCauseOfDeathList'

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
    expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(2)
    expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(2)
    expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(2)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByLabelText('Specificera tillståndet')
    const dates = screen.getAllByLabelText('Ungefärlig debut')
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
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByLabelText('Specificera tillståndet')
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    descriptions.forEach((description) => {
      expect(description).toHaveValue('')
    })
    specifications.forEach((specification) => {
      expect(specification).toHaveValue('')
    })
    dates.forEach((date) => {
      expect(date).toHaveValue('')
    })
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByLabelText('Specificera tillståndet')
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText('Ungefärlig debut')
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
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByLabelText('Specificera tillståndet')
    const buttons = screen.getAllByRole('button')
    const dates = screen.getAllByLabelText('Ungefärlig debut')
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
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    const inputDate = '20200202'
    const expected = '2020-02-02'
    dates.forEach((date) => {
      userEvent.type(date, inputDate)
      expect(date).toHaveValue(expected)
    })
  })

  it('should display error when input is not a complete date', () => {
    renderComponent({ disabled: false, question })
    const dates = screen.getAllByLabelText('Ungefärlig debut')
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
    const dates = screen.getAllByLabelText('Ungefärlig debut')
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
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    dates.forEach((date) => {
      userEvent.type(date, '20200101')
      userEvent.tab()
      setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument(), 100)
      userEvent.clear(date)
      userEvent.tab()
    })
  })

  it.only('should add new row when button is clicked', () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText('Lägg till ytterligare sjukdom')
    userEvent.click(button)
    expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(3)
    expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(3)
    expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(3)
  })

  it('should not add more than 6 rows', () => {
    renderComponent({ disabled: false, question })
    const button = screen.getByLabelText('Lägg till ytterligare sjukdom')
    userEvent.click(button)
    setTimeout(() => {
      userEvent.click(button)
      setTimeout(() => userEvent.click(button), 100)
      setTimeout(() => userEvent.click(button), 100)
      setTimeout(() => userEvent.click(button), 100)
      expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(7)
      expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(7)
      expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(7)
      expect(button).not.toBeDisabled()
      setTimeout(() => userEvent.click(button), 100)
      expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(8)
      expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(8)
      expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(8)
      expect(button).toBeDisabled()
    }, 100)
  })
})
