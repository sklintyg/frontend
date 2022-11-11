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
import UeCauseOfDeathList from '../UeCauseOfDeathList'
import { Provider } from 'react-redux'
import store from '../../../../store/store'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const CAUSES_OF_DEATH = [
  {
    id: 'A',
    type: ConfigTypes.UE_CAUSE_OF_DEATH,
    label: 'A',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', label: 'Plötslig' },
    ],
  },
  {
    id: 'B',
    type: ConfigTypes.UE_CAUSE_OF_DEATH,
    label: 'B',
    title: 'Som var en följd av',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', label: 'Plötslig' },
    ],
  },
  {
    id: 'C',
    type: ConfigTypes.UE_CAUSE_OF_DEATH,
    label: 'C',
    title: 'Som var en följd av',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', label: 'Plötslig' },
    ],
  },
]

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'checkbox'

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  value: { type: CertificateDataValueType.CAUSE_OF_DEATH_LIST },
  config: {
    id: 'CauseOfDeathList',
    list: CAUSES_OF_DEATH,
    description: '',
    text: '',
    type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
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

const renderComponent = (disabled: boolean) => {
  render(
    <>
      <Provider store={store}>
        <UeCauseOfDeathList question={question} disabled={disabled} />
      </Provider>
    </>
  )
}

describe('Cause of death component', () => {
  it('renders without crashing', () => {
    renderComponent(false)
  })

  it('renders all components', () => {
    renderComponent(false)
    expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(CAUSES_OF_DEATH.length)
    expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(CAUSES_OF_DEATH.length)
    expect(screen.getAllByRole('button')).toHaveLength(CAUSES_OF_DEATH.length)
    expect(screen.getAllByRole('combobox')).toHaveLength(CAUSES_OF_DEATH.length)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent(false)
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByRole('combobox')
    const buttons = screen.getAllByRole('button')
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
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument()
    })
  })

  it('renders component with correct default values', () => {
    renderComponent(false)
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByRole('combobox')
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
    renderComponent(false)
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByRole('combobox')
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
    renderComponent(true)
    const descriptions = screen.getAllByLabelText('Beskrivning')
    const specifications = screen.getAllByRole('combobox')
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
    renderComponent(false)
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    const inputDate = '20200202'
    const expected = '2020-02-02'
    dates.forEach((date) => {
      userEvent.type(date, inputDate)
      expect(date).toHaveValue(expected)
    })
  })

  it('should display error when input is not a complete date', () => {
    renderComponent(false)
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    dates.forEach((date) => {
      userEvent.type(date, '2020-01')
      userEvent.tab()
      const error = screen.getByText(INVALID_DATE_MESSAGE)
      expect(error).toBeInTheDocument()
      userEvent.clear(date)
      userEvent.tab()
      expect(error).not.toBeInTheDocument()
    })
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false)
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    dates.forEach((date) => {
      userEvent.type(date, 'test')
      userEvent.tab()
      const error = screen.getByText(INVALID_DATE_MESSAGE)
      expect(error).toBeInTheDocument()
      userEvent.clear(date)
      userEvent.tab()
      expect(error).not.toBeInTheDocument()
    })
  })
})
