import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UeTypeahead from './UeTypeahead'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const suggestions = [
  { label: 'Hello, World!', disabled: false, title: null },
  { label: 'Suggestion 2', disabled: false, title: null },
  { label: 'Test', disabled: false, title: null },
  { label: 'String', disabled: true, title: null },
]

const question: CertificateDataElement = {
  id: 'typeahead',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.TEXT, list: [] },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_TYPE_AHEAD,
    list: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }],
  },
}

const defaultOnSuggestionSelected = jest.fn()

const renderDefaultComponent = () => {
  render(
    <>
      <UeTypeahead question={question} disabled={false} />
    </>
  )
}

const renderWithSuggestions = (open: boolean) => {
  render(
    <>
      <UeTypeahead question={question} disabled={false} />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue({
    typeahead: suggestions,
    resultat: 'OK',
  })
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Typeahead  component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('does not render suggestions when array is empty', () => {
    renderDefaultComponent()
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })
  it('does not render suggestions when open is false', () => {
    renderWithSuggestions(false)
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })
})
