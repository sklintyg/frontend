import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
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
} from '@frontend/common'

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

  it('displays several code values', () => {
    const question = createQuestionWithMultipleCodeValues()
    const { getByText } = render(<UvText question={question} />)
    expect(getByText('Code 1')).toBeInTheDocument()
    expect(getByText('Code 2')).toBeInTheDocument()
  })

  it('Verify snapshot', () => {
    const question = createQuestionWithTextValue()
    const tree = renderer.create(<UvText question={question} />).toJSON()
    expect(tree).toMatchSnapshot()
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
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_CODE,
        id: 'CODE_1',
        label: 'Code 1',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_CODE,
        id: 'CODE_2',
        label: 'Code 2',
      },
      {
        text: '',
        description: '',
        type: ConfigTypes.UE_CHECKBOX_CODE,
        id: 'CODE_3',
        label: 'Code 3',
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
