import React from 'react'
import ReactDOM from 'react-dom'
import 'jest-styled-components'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UvText from './UvText'
import {
  ValueBoolean,
  CertificateDataElement,
  CertificateDataConfig,
  Value,
  CertificateDataValueType,
  ValueText,
  ConfigTypes,
  ConfigUeRadioBoolean,
  ConfigUeTextArea,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeRadioMultipleCodes,
  ValueCode,
  ValueCodeList,
  ValueIcf,
  ConfigUeIcf,
} from '@frontend/common'
import { ConfigUeCheckboxMultipleDate, ValueDateList } from '../..'
import { ConfigUeSickLeavePeriod, ValueDateRangeList } from '../../types/certificate'

describe('UvText', () => {
  it('renders without crashing', () => {
    const question = createQuestionWithTextValue()
    const div = document.createElement('div')
    ReactDOM.render(<UvText question={question} />, div)
  })

  it('displaying text value', () => {
    const question = createQuestionWithTextValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/Text/i)
  })

  it('displaying boolean value', () => {
    const question = createQuestionWithBooleanValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/Boolean value = true/i)
  })

  it('displaying boolean true value for checkbox boolean value', () => {
    const question = createQuestionWithCheckboxBooleanValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/Boolean value = true/i)
  })

  it('displaying empty value', () => {
    const question = createQuestionWithTextValue()
    ;(question.value as ValueText).text = null
    // const question = createQuestion({ type: CertificateDataValueType.TEXT } as Value)
    const { getByText } = render(<UvText question={question} />)
    getByText(/Ej angivet/i)
  })

  it('displaying unknown value type', () => {
    const question = createQuestionWithTextValue()
    ;(question.value as ValueText).type = CertificateDataValueType.UNKNOWN
    const { getByText } = render(<UvText question={question} />)
    getByText(/Okänd datatyp/i)
  })

  it('displays code value', () => {
    const question = createQuestionWithCodeValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/This code/i)
  })

  it('displays no icf collections label if empty icf list', () => {
    const question = createQuestionWithIcfValue([])
    render(<UvText question={question} />)

    expect(screen.queryByText(question.config.collectionsLabel as string)).not.toBeInTheDocument()
  })

  it('displays icf collections label if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    render(<UvText question={question} />)

    expect(screen.getByText(question.config.collectionsLabel as string)).toBeInTheDocument()
  })

  it('displays icf values if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    const questionValue = question.value as ValueIcf
    render(<UvText question={question} />)

    expect(screen.getByText(questionValue.icfCodes![0])).toBeInTheDocument()
    expect(screen.getByText(questionValue.icfCodes![1])).toBeInTheDocument()
  })

  it('displays icf text value', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    const questionValue = question.value as ValueIcf
    render(<UvText question={question} />)

    expect(screen.getByText(questionValue.text as string)).toBeInTheDocument()
  })

  it('displays several code values', () => {
    const question = createQuestionWithMultipleCodeValues()
    const { getByText } = render(<UvText question={question} />)
    expect(getByText('Code 1')).toBeInTheDocument()
    expect(getByText('Code 2')).toBeInTheDocument()
  })

  it('displays several date values', () => {
    const question = createQuestionWithMultipleDates()
    const { getByText } = render(<UvText question={question} />)
    expect(getByText('Datum 1')).toBeInTheDocument()
    expect(getByText('Datum 2')).toBeInTheDocument()
    expect(getByText('Datum 3')).toBeInTheDocument()
    expect(getByText('Ej angivet')).toBeInTheDocument()
  })

  it('displays several date range values', () => {
    const question = createQuestionWithMultipleDateRanges()
    render(<UvText question={question} />)

    expect(screen.getByText('2021-06-22')).toBeInTheDocument()
    expect(screen.getByText('2021-06-25')).toBeInTheDocument()
    expect(screen.getByText('2021-06-26')).toBeInTheDocument()
    expect(screen.getByText('2021-06-28')).toBeInTheDocument()
  })
})

// Helper functions... Probably a good idea to create some utilities that can be reused....
export function createQuestionWithTextValue(): CertificateDataElement {
  const value: ValueText = {
    type: CertificateDataValueType.TEXT,
    text: 'Text',
    limit: 50,
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

export function createQuestionWithCheckboxBooleanValue(): CertificateDataElement {
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
    label: 'This is the label',
    text: '',
    type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
  }

  return createQuestion(value, config)
}

export function createQuestionWithBooleanValue(): CertificateDataElement {
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

export function createQuestionWithIcfValue(icfCodes: string[]): CertificateDataElement {
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

export function createQuestionWithCodeValue(): CertificateDataElement {
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

export function createQuestionWithMultipleCodeValues(): CertificateDataElement {
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
    id: '',
    text: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
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

export function createQuestionWithMultipleDates(): CertificateDataElement {
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
    id: '',
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

export const createQuestionWithMultipleDateRanges = (): CertificateDataElement => {
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
    id: '',
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

export function createQuestion(value: Value, config: CertificateDataConfig): CertificateDataElement {
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
