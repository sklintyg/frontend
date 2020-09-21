import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import UvText from './UvText'
import {
  CertificateBooleanValue,
  CertificateDataElement,
  CertificateDataValue,
  CertificateDataValueType,
  CertificateTextValue,
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
    const question = createQuestion({ type: CertificateDataValueType.TEXT } as CertificateDataValue)
    const { getByText } = render(<UvText question={question} />)
    getByText(/Ej angivet/i)
  })

  it('displaying unknown value type', () => {
    const question = createQuestion({ type: CertificateDataValueType.UNKNOWN } as CertificateDataValue)
    const { getByText } = render(<UvText question={question} />)
    getByText(/Okänd datatyp/i)
  })

  it('Verify snapshot', () => {
    const question = createQuestionWithTextValue()
    const tree = renderer.create(<UvText question={question} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

// Helper functions... Probably a good idea to create some utilities that can be reused....
export function createQuestionWithTextValue(): CertificateDataElement {
  const value: CertificateTextValue = {
    type: CertificateDataValueType.TEXT,
    text: 'Text',
    limit: 50,
  }
  return createQuestion(value)
}

export function createQuestionWithBooleanValue(): CertificateDataElement {
  const value: CertificateBooleanValue = {
    type: CertificateDataValueType.BOOLEAN,
    selected: true,
    selectedText: 'Boolean value = true',
    unselectedText: 'Boolean value = false',
  }
  return createQuestion(value)
}

export function createQuestion(value: CertificateDataValue): CertificateDataElement {
  return {
    id: 'id',
    readOnly: true,
    index: 0,
    mandatory: false,
    visible: true,
    parent: 'parent',
    validationErrors: [],
    validation: {
      hideExpression: 'null',
      required: false,
      requiredProp: 'null',
    },
    config: {
      text: 'Text',
      description: 'Description',
      component: 'null',
      prop: 'null',
    },
    value,
  }
}
