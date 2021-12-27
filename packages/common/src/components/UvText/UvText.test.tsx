import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UvText from './UvText'
import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeIcf,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeTextArea,
  Value,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueIcf,
  ValueText,
} from '@frontend/common'
import {
  ConfigUeCheckboxMultipleDate,
  ConfigUeDropdown,
  ConfigUeRadioMultipleCodesOptionalDropdown,
  getCertificateWithQuestion,
  ValueDateList,
} from '../..'
import { ConfigUeSickLeavePeriod, ValueDateRangeList } from '../../types/certificate'
import { Provider } from 'react-redux'
import { updateCertificate } from '@frontend/webcert/src/store/certificate/certificateActions'
import { EnhancedStore } from '@reduxjs/toolkit'

let testStore: EnhancedStore

const renderDefaultComponent = (question: CertificateDataElement) => {
  render(
    <Provider store={testStore}>
      <UvText question={question} />
    </Provider>
  )
}

describe('UvText', () => {
  it('renders without crashing', () => {
    const question = createQuestionWithTextValue()
    renderDefaultComponent(question)
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

  it('displaying unknown value type', () => {
    const question = createQuestionWithTextValue()
    ;(question.value as ValueText).type = CertificateDataValueType.UNKNOWN
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
    expect(screen.queryByText(question.config.collectionsLabel as string)).not.toBeInTheDocument()
  })

  it('displays icf collections label if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    renderDefaultComponent(question)
    expect(screen.getByText(question.config.collectionsLabel as string)).toBeInTheDocument()
  })

  it('displays icf values if icf list is not empty', () => {
    const question = createQuestionWithIcfValue(['test', 'test 2'])
    const questionValue = question.value as ValueIcf
    renderDefaultComponent(question)
    expect(screen.getByText(questionValue.icfCodes![0])).toBeInTheDocument()
    expect(screen.getByText(questionValue.icfCodes![1])).toBeInTheDocument()
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
    tesStore.dispatch(updateCertificate(getCertificateWithQuestion(dropdownQuestion)))
    renderDefaultComponent(question)
    expect(screen.getByText('Code 1 dropdown value')).toBeInTheDocument()
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
    id: 'questionId',
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
