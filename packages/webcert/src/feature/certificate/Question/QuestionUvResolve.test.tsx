import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigLayout,
  ConfigUeIcf,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDateRangeElement,
  fakeICFDataElement,
  fakeIntegerElement,
  fakeMessageElement,
  fakeRadioBooleanElement,
  fakeSickLeavePeriod,
  fakeTextAreaElement,
  fakeYearElement,
  MessageLevel,
  ValueIcf,
  ValueText,
  ValueYear,
} from '@frontend/common'
import { certificateMiddleware } from '@frontend/webcert/src/store/certificate/certificateMiddleware'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import QuestionUvResolve from './QuestionUvResolve'

let testStore: EnhancedStore

const renderDefaultComponent = (question: CertificateDataElement) => {
  render(
    <Provider store={testStore}>
      <QuestionUvResolve question={question} />
    </Provider>
  )
}

describe('QuestionUvResolve', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    const question = createQuestionWithTextValue()
    expect(() => renderDefaultComponent(question)).not.toThrow()
  })

  it('displaying text value', () => {
    const question = createQuestionWithTextValue()
    renderDefaultComponent(question)
    expect(screen.getByText(/Text/i)).toBeInTheDocument()
  })

  it('displaying boolean value', () => {
    const question = createQuestionWithBooleanValue()
    renderDefaultComponent(question)
    expect(screen.getByText(/Boolean value = true/i)).toBeInTheDocument()
  })

  it('displaying boolean true value for checkbox boolean value', () => {
    const question = createQuestionWithCheckboxBooleanValue()
    renderDefaultComponent(question)
    expect(screen.getByText(/Boolean value = true/i)).toBeInTheDocument()
  })

  it('displaying empty value', () => {
    const question = createQuestionWithTextValue()
    ;(question.value as ValueText).text = null
    renderDefaultComponent(question)
    expect(screen.getByText(/Ej angivet/i)).toBeInTheDocument()
  })

  it('Not displaying text value if visible is false', () => {
    const question = createQuestionWithTextValue()
    question.visible = false
    renderDefaultComponent(question)
    expect(screen.queryByText(/Text/i)).not.toBeInTheDocument()
  })

  it('Displaying text value if visible is true', () => {
    const question = createQuestionWithTextValue()
    question.visible = true
    renderDefaultComponent(question)
    expect(screen.getByText(/Text/i)).toBeInTheDocument()
  })

  it('displaying unknown value type', () => {
    const question = createQuestionWithTextValue()
    question.value = {
      ...question.value,
      type: CertificateDataValueType.UNKNOWN,
    }
    renderDefaultComponent(question)
    expect(screen.getByText(/Okänd datatyp/i)).toBeInTheDocument()
  })

  it('displays no icf collections label if empty icf list', () => {
    const question = createQuestionWithIcfValue([])
    renderDefaultComponent(question)
    expect(screen.queryByText((question.config as ConfigUeIcf).collectionsLabel as string)).not.toBeInTheDocument()
  })

  it('displays icf collections label if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    renderDefaultComponent(question)
    expect(screen.getByText((question.config as ConfigUeIcf).collectionsLabel as string)).toBeInTheDocument()
  })

  it('displays icf values if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    renderDefaultComponent(question)
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('test 2')).toBeInTheDocument()
  })

  it('displays icf text value', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    const questionValue = question.value as ValueIcf
    renderDefaultComponent(question)
    expect(screen.getByText(questionValue.text as string)).toBeInTheDocument()
  })

  it('displays several code values', () => {
    const question = createQuestionWithMultipleCodeValues()
    renderDefaultComponent(question)
    expect(screen.getByText('Code 1')).toBeInTheDocument()
    expect(screen.getByText('Code 2')).toBeInTheDocument()
  })

  it('displays several date values', () => {
    const question = createQuestionWithMultipleDates()
    renderDefaultComponent(question)
    expect(screen.getByText('Datum 1')).toBeInTheDocument()
    expect(screen.getByText('Datum 2')).toBeInTheDocument()
    expect(screen.getByText('Datum 3')).toBeInTheDocument()
    expect(screen.getByText('Ej angivet')).toBeInTheDocument()
  })

  it('displays date range value', () => {
    const question = createQuestionWithDateRange()
    renderDefaultComponent(question)
    expect(screen.getByText('2021-06-22')).toBeInTheDocument()
    expect(screen.getByText('2021-06-25')).toBeInTheDocument()
  })

  it('displays several date range values', () => {
    const question = createQuestionWithMultipleDateRanges()
    renderDefaultComponent(question)
    expect(screen.getByText('2021-06-22')).toBeInTheDocument()
    expect(screen.getByText('2021-06-25')).toBeInTheDocument()
    expect(screen.getByText('2021-06-26')).toBeInTheDocument()
    expect(screen.getByText('2021-06-28')).toBeInTheDocument()
  })

  it('should render ue_message if visible is true', () => {
    const question = createQuestionWithUeMessageConfig()
    renderDefaultComponent(question)
    expect(screen.queryByText(/Hello from UE_MESSAGE/i)).toBeInTheDocument()
  })
  it('should not render ue_message if visible is false', () => {
    const question = createQuestionWithUeMessageConfig()
    question.visible = false
    renderDefaultComponent(question)
    expect(screen.queryByText(/Hello from UE_MESSAGE/i)).not.toBeInTheDocument()
  })

  it('displaying year value', () => {
    const question = createQuestionWithYearValue()
    renderDefaultComponent(question)
    expect(screen.getByText(/2020/i)).toBeInTheDocument()
  })

  it('displaying empty year value', () => {
    const question = createQuestionWithYearValue()
    ;(question.value as ValueYear).year = undefined
    renderDefaultComponent(question)
    expect(screen.getByText(/Ej angivet/i)).toBeInTheDocument()
  })

  it('Not displaying year value if visible is false', () => {
    const question = createQuestionWithYearValue()
    question.visible = false
    renderDefaultComponent(question)
    expect(screen.queryByText(/2020/i)).not.toBeInTheDocument()
  })

  it('Displaying year value if visible is true', () => {
    const question = createQuestionWithYearValue()
    question.visible = true
    renderDefaultComponent(question)
    expect(screen.getByText(/2020/i)).toBeInTheDocument()
  })

  it('Displays the correct value and unit of measurement', () => {
    const question = createQuestionWithIntegerValue()
    renderDefaultComponent(question)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})

function createQuestionWithTextValue(): CertificateDataElement {
  return fakeTextAreaElement({ id: 'id', value: { text: 'Text' } })['id']
}

function createQuestionWithCheckboxBooleanValue(): CertificateDataElement {
  return fakeCheckboxBooleanElement({
    id: 'id',
    config: { selectedText: 'Boolean value = true', unselectedText: 'Boolean value = false', label: 'This is the label' },
    value: { selected: true },
  })['id']
}

function createQuestionWithBooleanValue(): CertificateDataElement {
  return fakeRadioBooleanElement({
    id: 'id',
    value: {
      type: CertificateDataValueType.BOOLEAN,
      selected: true,
    },
    config: {
      selectedText: 'Boolean value = true',
      unselectedText: 'Boolean value = false',
    },
  })['id']
}

function createQuestionWithIcfValue(icfCodes: string[]): CertificateDataElement {
  return fakeICFDataElement({
    id: 'id',
    value: {
      text: 'text value',
      icfCodes: icfCodes,
    },
    config: {
      label: 'label',
      collectionsLabel: 'collections label',
      modalLabel: '',
      placeholder: '',
    },
  })['id']
}

function createQuestionWithMultipleCodeValues(): CertificateDataElement {
  return fakeCheckboxMultipleCodeElement({
    id: 'id',
    value: {
      list: [
        {
          id: 'CODE_1',
          code: 'CODE_1',
        },
        {
          id: 'CODE_2',
          code: 'CODE_2',
        },
      ],
    },
    config: {
      description: '',
      text: '',
      layout: ConfigLayout.ROWS,
      list: [
        {
          id: 'CODE_1',
          label: 'Code 1',
        },
        {
          id: 'CODE_2',
          label: 'Code 2',
        },
        {
          id: 'CODE_3',
          label: 'Code 3',
        },
      ],
    },
  })['id']
}

function createQuestionWithMultipleDates(): CertificateDataElement {
  return fakeCheckboxMultipleDate({
    id: 'id',
    config: {
      list: [
        {
          text: '',
          description: '',
          id: 'DATE_1',
          label: 'Datum 1',
        },
        {
          text: '',
          description: '',
          id: 'DATE_2',
          label: 'Datum 2',
        },
        {
          text: '',
          description: '',
          id: 'DATE_3',
          label: 'Datum 3',
        },
      ],
    },
    value: {
      list: [
        {
          id: 'DATE_1',
          date: '2020-02-02',
        },
        {
          id: 'DATE_2',
          date: '2021-05-05',
        },
      ],
    },
  })['id']
}

const createQuestionWithDateRange = (): CertificateDataElement => {
  return fakeDateRangeElement({
    id: 'id',
    value: {
      id: 'DATE_1',
      from: '2021-06-22',
      to: '2021-06-25',
    },
    config: {
      id: 'DATE_1',
    },
  })['id']
}

const createQuestionWithMultipleDateRanges = (): CertificateDataElement => {
  return fakeSickLeavePeriod({
    id: 'id',
    config: {
      list: [
        {
          text: '',
          description: '',
          id: 'DATE_1',
          label: 'Datum 1',
        },
        {
          text: '',
          description: '',
          id: 'DATE_2',
          label: 'Datum 2',
        },
      ],
    },
    value: {
      list: [
        {
          id: 'DATE_1',
          from: '2021-06-22',
          to: '2021-06-25',
        },
        {
          id: 'DATE_2',
          from: '2021-06-26',
          to: '2021-06-28',
        },
      ],
    },
  })['id']
}

function createQuestionWithUeMessageConfig(): CertificateDataElement {
  return fakeMessageElement({
    id: 'id',
    config: {
      level: MessageLevel.OBSERVE,
      message: 'Hello from UE_MESSAGE',
    },
  })['id']
}

function createQuestionWithIntegerValue(): CertificateDataElement {
  return fakeIntegerElement({ id: 'id', config: { unitOfMeasurement: '%' }, value: { value: 50 } })['id']
}

function createQuestionWithYearValue(): CertificateDataElement {
  return fakeYearElement({ id: 'id', value: { year: 2020 } })['id']
}
