import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigLayout,
  ConfigTypes,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDateRange,
  ConfigUeDropdown,
  ConfigUeIcf,
  ConfigUeInteger,
  ConfigUeMessage,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  ConfigUeSickLeavePeriod,
  ConfigUeTextArea,
  ConfigUeYear,
  fakeDateRangeElement,
  getCertificateWithQuestion,
  MessageLevel,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueIcf,
  ValueInteger,
  ValueText,
  ValueType,
  ValueYear,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
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

// Helper functions... Probably a good idea to create some utilities that can be reused....
function createQuestionWithTextValue(): CertificateDataElement {
  const value: ValueText = {
    type: CertificateDataValueType.TEXT,
    text: 'Text',
    id: '',
  }
  const config: ConfigUeTextArea = {
    description: '',
    id: '',
    text: '',
    type: ConfigTypes.UE_TEXTAREA,
  }

  return createQuestion(value, config)
}

function createQuestionWithCheckboxBooleanValue(): CertificateDataElement {
  const value: ValueBoolean = {
    type: CertificateDataValueType.BOOLEAN,
    selected: true,
    id: '',
  }
  const config: ConfigUeCheckboxBoolean = {
    id: '',
    selectedText: 'Boolean value = true',
    unselectedText: 'Boolean value = false',
    description: '',
    label: 'This is the label',
    text: '',
    type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
  }

  return createQuestion(value, config)
}

function createQuestionWithBooleanValue(): CertificateDataElement {
  const value: ValueBoolean = {
    type: CertificateDataValueType.BOOLEAN,
    selected: true,
    id: '',
  }
  const config: ConfigUeRadioBoolean = {
    id: '',
    selectedText: 'Boolean value = true',
    unselectedText: 'Boolean value = false',
    description: '',
    label: '',
    text: '',
    type: ConfigTypes.UE_RADIO_BOOLEAN,
  }

  return createQuestion(value, config)
}

function createQuestionWithIcfValue(icfCodes: string[]): CertificateDataElement {
  const value: ValueIcf = {
    type: CertificateDataValueType.ICF,
    id: '',
    text: 'text value',
    icfCodes: icfCodes,
  }
  const config: ConfigUeIcf = {
    description: '',
    id: '',
    text: '',
    type: ConfigTypes.UE_ICF,
    label: 'label',
    collectionsLabel: 'collections label',
    modalLabel: '',
    placeholder: '',
  }

  return createQuestion(value, config)
}

function createQuestionWithCodeValue(): CertificateDataElement {
  const value: ValueCode = {
    type: CertificateDataValueType.CODE,
    id: 'THIS_CODE',
    code: 'CODE',
  }
  const config: ConfigUeRadioMultipleCodes = {
    description: '',
    id: '',
    text: '',
    type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
    layout: ConfigLayout.ROWS,
    list: [
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_RADIO_CODE,
        id: 'THIS_CODE',
        label: 'This code',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_RADIO_CODE,
        id: 'NOT_THIS_CODE',
        label: 'Not this code',
      },
    ],
  }

  return createQuestion(value, config)
}

function createQuestionWithMultipleCodeValues(): CertificateDataElement {
  const value: ValueCodeList = {
    type: CertificateDataValueType.CODE_LIST,
    list: [
      {
        type: CertificateDataValueType.CODE,
        id: 'CODE_1',
        code: 'CODE_1',
      },
      {
        type: CertificateDataValueType.CODE,
        id: 'CODE_2',
        code: 'CODE_2',
      },
    ],
  }
  const config: ConfigUeCheckboxMultipleCodes = {
    description: '',
    text: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
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
  }
  return createQuestion(value, config)
}

function createQuestionWithMultipleDates(): CertificateDataElement {
  const value: ValueDateList = {
    type: CertificateDataValueType.DATE_LIST,
    list: [
      {
        type: CertificateDataValueType.DATE,
        id: 'DATE_1',
        date: '2020-02-02',
      },
      {
        type: CertificateDataValueType.DATE,
        id: 'DATE_2',
        date: '2021-05-05',
      },
    ],
  }
  const config: ConfigUeCheckboxMultipleDate = {
    description: '',
    text: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
    list: [
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_DATE,
        id: 'DATE_1',
        label: 'Datum 1',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_DATE,
        id: 'DATE_2',
        label: 'Datum 2',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_DATE,
        id: 'DATE_3',
        label: 'Datum 3',
      },
    ],
  }
  return createQuestion(value, config)
}

const createQuestionWithDateRange = (): CertificateDataElement => {
  const question = fakeDateRangeElement({
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

  return createQuestion(question.value as ValueDateRange, question.config as ConfigUeDateRange)
}

const createQuestionWithMultipleDateRanges = (): CertificateDataElement => {
  const value: ValueDateRangeList = {
    type: CertificateDataValueType.DATE_RANGE_LIST,
    list: [
      {
        id: 'DATE_1',
        from: '2021-06-22',
        to: '2021-06-25',
        type: CertificateDataValueType.DATE_RANGE,
      },
      {
        id: 'DATE_2',
        from: '2021-06-26',
        to: '2021-06-28',
        type: CertificateDataValueType.DATE_RANGE,
      },
    ],
  }
  const config: ConfigUeSickLeavePeriod = {
    description: '',
    text: '',
    type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
    previousSickLeavePeriod: '',
    list: [
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE_RANGE,
        id: 'DATE_1',
        label: 'Datum 1',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE_RANGE,
        id: 'DATE_2',
        label: 'Datum 2',
      },
    ],
  }

  return createQuestion(value, config)
}

const createQuestionWithOptionalDropdown = () => {
  const value: ValueCode = {
    type: CertificateDataValueType.CODE,
    id: 'CODE_1',
    code: 'CODE_1',
  }

  const config: ConfigUeRadioMultipleCodesOptionalDropdown = {
    description: '',
    id: '',
    text: '',
    type: ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN,
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
  }
  return createQuestion(value, config)
}

const createDropdownQuestion = () => {
  const value: ValueCode = {
    type: CertificateDataValueType.CODE,
    id: 'CODE_DROPDOWN',
    code: 'CODE_DROPDOWN',
  }

  const config: ConfigUeDropdown = {
    description: '',
    text: '',
    type: ConfigTypes.UE_DROPDOWN,
    list: [
      {
        id: 'CODE_DROPDOWN',
        label: 'dropdown value',
      },
    ],
  }
  return {
    id: 'questionId',
    readOnly: true,
    index: 0,
    mandatory: false,
    visible: true,
    parent: 'parent',
    validationErrors: [],
    validation: [],
    config,
    value,
  }
}
function createQuestionWithUeMessageConfig(): CertificateDataElement {
  const value: ValueText = {
    type: CertificateDataValueType.TEXT,
    text: 'Text',
    id: '',
  }
  const config: ConfigUeMessage = {
    description: '',
    text: '',
    type: ConfigTypes.UE_MESSAGE,
    level: MessageLevel.OBSERVE,
    message: 'Hello from UE_MESSAGE',
    id: '1.1',
  }

  return createQuestion(value, config)
}

function createQuestionWithIntegerValue(): CertificateDataElement {
  const value: ValueInteger = {
    type: CertificateDataValueType.INTEGER,
    id: '',
    value: 50,
  }
  const config: ConfigUeInteger = {
    type: ConfigTypes.UE_INTEGER,
    id: '',
    unitOfMeasurement: '%',
    text: '',
    description: '',
  }

  return createQuestion(value, config)
}

function createQuestionWithYearValue(): CertificateDataElement {
  const value: ValueYear = {
    type: CertificateDataValueType.YEAR,
    year: 2020,
    id: '',
  }
  const config: ConfigUeYear = {
    description: '',
    text: '',
    id: '',
    type: ConfigTypes.UE_YEAR,
  }

  return createQuestion(value, config)
}

function createQuestion(value: ValueType, config: CertificateDataConfig): CertificateDataElement {
  return {
    id: 'id',
    readOnly: true,
    index: 0,
    mandatory: false,
    visible: true,
    parent: 'parent',
    validationErrors: [],
    validation: [],
    config,
    value,
  }
}
