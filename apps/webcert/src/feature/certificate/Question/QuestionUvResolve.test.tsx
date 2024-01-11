import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigTypes,
  ConfigUeIcf,
  fakeCertificateConfig,
  fakeCertificateValue,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDateRangeElement,
  fakeDropdownElement,
  fakeICFDataElement,
  fakeIntegerElement,
  fakeMessageElement,
  fakeRadioBooleanElement,
  fakeRadioMultipleCodesOptionalDropdown,
  fakeSickLeavePeriod,
  fakeTextAreaElement,
  fakeYearElement,
  getCertificateWithQuestion,
  MessageLevel,
  ValueIcf,
  ValueText,
  ValueYear,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import QuestionUvResolve from './QuestionUvResolve'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

let testStore: EnhancedStore

function createQuestionWithTextValue(): CertificateDataElement {
  return fakeTextAreaElement({ id: 'id', value: { text: 'Text' } }).id
}

function createQuestionWithCheckboxBooleanValue(): CertificateDataElement {
  return fakeCheckboxBooleanElement({
    id: 'id',
    value: { selected: true },
    config: {
      selectedText: 'Boolean value = true',
      unselectedText: 'Boolean value = false',
      label: 'This is the label',
    },
  }).id
}

function createQuestionWithBooleanValue(): CertificateDataElement {
  return fakeRadioBooleanElement({
    id: 'id',
    value: { selected: true },
    config: { selectedText: 'Boolean value = true', unselectedText: 'Boolean value = false' },
  }).id
}

function createQuestionWithIcfValue(icfCodes: string[]): CertificateDataElement {
  return fakeICFDataElement({
    id: 'id',
    value: { text: 'text value', icfCodes },
    config: { label: 'label', collectionsLabel: 'collections label' },
  }).id
}

function createQuestionWithCodeValue(): CertificateDataElement {
  return fakeDropdownElement({
    id: 'id',
    value: { id: 'THIS_CODE', code: 'CODE' },
    config: {
      list: [
        fakeCertificateConfig.radioCode({
          id: 'THIS_CODE',
          label: 'This code',
        }),
        fakeCertificateConfig.radioCode({
          id: 'NOT_THIS_CODE',
          label: 'Not this code',
        }),
      ],
    },
  }).id
}

function createQuestionWithMultipleCodeValues(): CertificateDataElement {
  return fakeCheckboxMultipleCodeElement({
    id: 'id',
    value: {
      list: Array.from({ length: 2 }, (_, index) =>
        fakeCertificateValue.code({
          id: `CODE_${index + 1}`,
          code: `CODE_${index + 1}`,
        })
      ),
    },
    config: {
      list: Array.from({ length: 3 }, (_, index) => ({
        id: `CODE_${index + 1}`,
        label: `Code ${index + 1}`,
      })),
    },
  }).id
}

function createQuestionWithMultipleDates(): CertificateDataElement {
  return fakeCheckboxMultipleDate({
    id: 'id',
    value: {
      list: [
        fakeCertificateValue.date({
          id: 'DATE_1',
          date: '2020-02-02',
        }),
        fakeCertificateValue.date({
          id: 'DATE_2',
          date: '2021-05-05',
        }),
      ],
    },
    config: {
      list: Array.from({ length: 3 }, (_, index) =>
        fakeCertificateConfig.checkboxDate({ id: `DATE_${index + 1}`, label: `Datum ${index + 1}` })
      ),
    },
  }).id
}

const createQuestionWithDateRange = (): CertificateDataElement =>
  fakeDateRangeElement({
    id: 'id',
    value: {
      id: 'DATE_1',
      from: '2021-06-22',
      to: '2021-06-25',
    },
    config: {
      id: 'DATE_1',
    },
  }).id

const createQuestionWithMultipleDateRanges = (): CertificateDataElement =>
  fakeSickLeavePeriod({
    id: 'id',
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
    config: {
      list: Array.from({ length: 3 }, (_, index) => ({
        id: `DATE_${index + 1}`,
        label: `Datum ${index + 1}`,
      })),
    },
  }).id

const createQuestionWithOptionalDropdown = () =>
  fakeRadioMultipleCodesOptionalDropdown({
    id: 'id',
    value: {
      id: 'CODE_1',
      code: 'CODE_1',
    },
    config: {
      list: [
        {
          id: 'CODE_1',
          label: 'Code 1',
          dropdownQuestionId: 'questionId',
        },
        {
          id: 'CODE_2',
          label: 'Code 2',
          dropdownQuestionId: '',
        },
        {
          id: 'CODE_3',
          label: 'Code 3',
          dropdownQuestionId: '',
        },
      ],
    },
  }).id

const createDropdownQuestion = () =>
  fakeDropdownElement({
    id: 'questionId',
    value: {
      type: CertificateDataValueType.CODE,
      id: 'CODE_DROPDOWN',
      code: 'CODE_DROPDOWN',
    },
    config: {
      type: ConfigTypes.UE_DROPDOWN,
      list: [
        {
          id: 'CODE_DROPDOWN',
          label: 'dropdown value',
        },
      ],
    },
  }).questionId

function createQuestionWithUeMessageConfig(): CertificateDataElement {
  return fakeMessageElement({
    id: 'id',
    config: {
      level: MessageLevel.OBSERVE,
      message: 'Hello from UE_MESSAGE',
      id: '1.1',
    },
  }).id
}

function createQuestionWithIntegerValue(): CertificateDataElement {
  return fakeIntegerElement({
    id: 'id',
    value: { value: 50 },
    config: { unitOfMeasurement: '%' },
  }).id
}

function createQuestionWithYearValue(): CertificateDataElement {
  return fakeYearElement({
    id: 'id',
    value: { year: 2020 },
  }).id
}

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

  it('displays code value', () => {
    const question = createQuestionWithCodeValue()
    renderDefaultComponent(question)
    expect(screen.getByText(/This code/i)).toBeInTheDocument()
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

  it('should add text of optional dropdown to radio group text', () => {
    const question = createQuestionWithOptionalDropdown()
    const dropdownQuestion = createDropdownQuestion()
    testStore.dispatch(updateCertificate(getCertificateWithQuestion(dropdownQuestion)))
    renderDefaultComponent(question)
    expect(screen.getByText('Code 1 dropdown value')).toBeInTheDocument()
  })
  it('should render ue_message if visible is true', () => {
    const question = createQuestionWithUeMessageConfig()
    renderDefaultComponent(question)
    expect(screen.getByText(/Hello from UE_MESSAGE/i)).toBeInTheDocument()
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
