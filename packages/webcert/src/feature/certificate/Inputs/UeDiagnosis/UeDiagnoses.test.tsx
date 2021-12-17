import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeDiagnoses from './UeDiagnoses'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CODE_SYSTEM = 'ICD_10'
const CODE_INPUT = 'F50'
const OTHER_CODE_SYSTEM = 'Annat'
const DIAGNOSES = [
  { kod: 'F501', beskrivning: 'Ätstörningar' },
  { kod: 'F502', beskrivning: 'Anorexia' },
]

const question: CertificateDataElement = {
  id: 'diagnos',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.DIAGNOSIS, list: [] },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_DIAGNOSES,
    terminology: [
      { id: CODE_SYSTEM, label: CODE_SYSTEM.replace('_', '-') },
      { id: OTHER_CODE_SYSTEM, label: OTHER_CODE_SYSTEM },
    ],
    list: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }],
  },
}

const renderDefaultComponent = () => {
  render(
    <>
      <UeDiagnoses question={question} disabled={false} />
    </>
  )
}

const checkVisibilityOfList = () => {
  const listItems = screen.queryAllByRole('option')
  const lists = screen.queryAllByRole('list')
  expect(lists).toHaveLength(1)
  expect(listItems).toHaveLength(DIAGNOSES.length)
}

const checkThatInputsAreEmpty = (indexToSkip: number, input: HTMLElement[]) => {
  input.forEach((i: any) => {
    if (i > indexToSkip) {
      expect(i).toHaveValue('')
    }
  })
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue({
    diagnoser: DIAGNOSES,
    resultat: 'OK',
  })
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Diagnoses component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('has correct default behaviour', () => {
    renderDefaultComponent()
    const input = screen.queryAllByRole('textbox')
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[0]).not.toBeDisabled()
    expect(radioButtons[1]).not.toBeDisabled()
    input.forEach((i: any) => {
      expect(i).toHaveValue('')
      expect(i).not.toBeDisabled()
    })
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('removes values when switching code system', () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio')
    const input = screen.queryAllByRole('textbox')
    userEvent.click(input[1])
    userEvent.type(input[1], CODE_INPUT)
    userEvent.click(screen.queryAllByRole('option')[0])
    expect(input[0]).toHaveValue(DIAGNOSES[0].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[0].beskrivning)
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    userEvent.click(radioButtons[1])
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).toBeChecked()
    expect(input[0]).toHaveValue('')
    expect(input[1]).toHaveValue('')
  })

  it('allows user to write values in text boxes', () => {
    renderDefaultComponent()
    const input = screen.queryAllByRole('textbox')
    userEvent.click(input[0])
    userEvent.type(input[0], CODE_INPUT)
    expect(input[0]).toHaveValue(CODE_INPUT)
    checkVisibilityOfList()
    checkThatInputsAreEmpty(0, input)
    userEvent.click(screen.queryAllByRole('option')[1])
    expect(input[0]).toHaveValue(DIAGNOSES[1].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[1].beskrivning)
    checkThatInputsAreEmpty(1, input)
    userEvent.click(input[5])
    userEvent.type(input[5], CODE_INPUT)
    checkVisibilityOfList()
    userEvent.click(screen.queryAllByRole('option')[0])
    expect(input[4]).toHaveValue(DIAGNOSES[0].kod)
    expect(input[5]).toHaveValue(DIAGNOSES[0].beskrivning)
    expect(input[2]).toHaveValue('')
    expect(input[3]).toHaveValue('')
  })
})
