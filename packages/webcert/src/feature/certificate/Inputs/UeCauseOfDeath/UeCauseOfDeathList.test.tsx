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
import UeCauseOfDeathList from './UeCauseOfDeathList'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const VALIDATION_ERROR = 'Ange ett svar'
const QUESTION_ID = 'checkbox'

const CONFIG_LIST = [
  {
    id: 'sjukdom1',
    descriptionId: 'description1',
    debutId: 'debut1',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
    ],
  },
  {
    id: 'sjukdom2',
    descriptionId: 'description2',
    debutId: 'debut2',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
    ],
  },
  {
    id: 'sjukdom3',
    descriptionId: 'description3',
    debutId: 'debut3',
    specifications: [
      { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
      { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
      { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
    ],
  },
]

const question: CertificateDataElement = {
  id: QUESTION_ID,
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  config: {
    type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
    text: 'Andra sjukdomar som kan ha bidragit till dödsfallet',
    description: '',
    list: CONFIG_LIST,
  },
  value: {
    type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
    list: [
      {
        id: 'sjukdom1',
        description: {
          type: CertificateDataValueType.TEXT,
          id: 'description1',
        },
        debut: {
          type: CertificateDataValueType.DATE,
          id: 'debut1',
        },
        specification: {
          type: CertificateDataValueType.CODE,
        },
        type: CertificateDataValueType.CAUSE_OF_DEATH,
      },
      {
        id: 'sjukdom2',
        description: {
          type: CertificateDataValueType.TEXT,
          id: 'description2',
        },
        debut: {
          type: CertificateDataValueType.DATE,
          id: 'debut2',
        },
        specification: {
          type: CertificateDataValueType.CODE,
        },
        type: CertificateDataValueType.CAUSE_OF_DEATH,
      },
      {
        id: 'sjukdom3',
        description: {
          type: CertificateDataValueType.TEXT,
          id: 'description3',
        },
        debut: {
          type: CertificateDataValueType.DATE,
          id: 'debut3',
        },
        specification: {
          type: CertificateDataValueType.CODE,
        },
        type: CertificateDataValueType.CAUSE_OF_DEATH,
      },
    ],
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
    expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(2)
    expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(2)
    expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(2)
  })

  it('renders, textinput, calendar button and drop down', () => {
    renderComponent(false)
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
    renderComponent(false)
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
    renderComponent(false)
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
    renderComponent(true)
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
    renderComponent(false)
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
    renderComponent(false)
    const dates = screen.getAllByLabelText('Ungefärlig debut')
    dates.forEach((date) => {
      userEvent.type(date, '20200101')
      userEvent.tab()
      setTimeout(() => expect(screen.getByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument(), 100)
      userEvent.clear(date)
      userEvent.tab()
    })
  })

  it('should add new row when button is clicked', () => {
    renderComponent(false)
    const button = screen.getByLabelText('Lägg till ytterligare sjukdom')
    userEvent.click(button)
    expect(screen.getAllByLabelText('Beskrivning')).toHaveLength(3)
    expect(screen.getAllByLabelText('Ungefärlig debut')).toHaveLength(3)
    expect(screen.getAllByLabelText('Specificera tillståndet')).toHaveLength(3)
  })

  it('should not add more than 6 rows', () => {
    renderComponent(false)
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
