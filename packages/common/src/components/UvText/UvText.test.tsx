import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import UvText from './UvText'
import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeRadioBoolean,
  Value,
  ValueBoolean,
  ValueText,
} from '@frontend/common'
import { ConfigTypes, ConfigUeTextArea } from '../../types/certificate'

describe('UvText', () => {
  it('renders without crashing', () => {
    const question = createQuestionWithTextValue('Text')
    const div = document.createElement('div')
    ReactDOM.render(<UvText question={question} />, div)
  })

  it('displaying text value', () => {
    const question = createQuestionWithTextValue('Text')
    const { getByText } = render(<UvText question={question} />)
    getByText(/Text/i)
  })

  it('displaying boolean value', () => {
    const question = createQuestionWithBooleanValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/Boolean value = true/i)
  })

  it('displaying empty value', () => {
    const question = createQuestionWithTextValue(null)
    const { getByText } = render(<UvText question={question} />)
    getByText(/Ej angivet/i)
  })

  it('displaying unknown value type', () => {
    const question = createQuestionWithUnknownValue()
    const { getByText } = render(<UvText question={question} />)
    getByText(/Okänd datatyp/i)
  })

  it('Verify snapshot', () => {
    const question = createQuestionWithTextValue('Text')
    const tree = renderer.create(<UvText question={question} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

// Helper functions... Probably a good idea to create some utilities that can be reused....
export function createQuestionWithTextValue(text: string | null): CertificateDataElement {
  const config: ConfigUeTextArea = {
    type: ConfigTypes.UE_TEXTAREA,
    description: 'Description',
    id: 'id',
    text: 'Text',
  }

  const value: ValueText = {
    id: 'id',
    type: CertificateDataValueType.TEXT,
    text: text,
    limit: 50,
  }
  return createQuestion(config, value)
}

export function createQuestionWithBooleanValue(): CertificateDataElement {
  const config: ConfigUeRadioBoolean = {
    label: 'label',
    selectedText: 'Boolean value = true',
    unselectedText: 'Boolean value = false',
    type: ConfigTypes.UE_RADIO_BOOLEAN,
    description: 'Description',
    id: 'id',
    text: 'Text',
  }

  const value: ValueBoolean = {
    id: 'id',
    type: CertificateDataValueType.BOOLEAN,
    selected: true,
  }
  return createQuestion(config, value)
}

export function createQuestionWithUnknownValue(): CertificateDataElement {
  const config: ConfigUeTextArea = {
    type: ConfigTypes.UE_TEXTAREA,
    description: 'Description',
    id: 'id',
    text: 'Text',
  }

  const value: Value = {
    type: CertificateDataValueType.UNKNOWN,
  }

  return createQuestion(config, value)
}

export function createQuestion(config: CertificateDataConfig, value: Value): CertificateDataElement {
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
