import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeDiagnosis from './UeDiagnosis'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CODE_SYSTEM = 'ICD_10'
const DIAGNOSES = [
  { kod: 'F50', beskrivning: 'Ätstörningar' },
  { kod: 'F500', beskrivning: 'Anorexia nervosa' },
  { kod: 'F501', beskrivning: 'Atypisk anorexia nervosa' },
  { kod: 'F502', beskrivning: 'Bulimia nervosa' },
  { kod: 'F503', beskrivning: 'Atypisk bulimia nervosa' },
  { kod: 'F504', beskrivning: 'Överdrivet ätande sammanhängande med andra psykiska störningar' },
  { kod: 'F505', beskrivning: 'Kräkningar sammanhängande med andra psykiska störningar' },
  { kod: 'F508', beskrivning: 'Andra specificerade ätstörningar' },
  { kod: 'F509', beskrivning: 'Ätstörning, ospecificerad' },
]

const testInput1 = 'ä'
const testInput2 = 'tst'

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
    terminology: ['ICD_10', 'Annat'],
    list: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }],
  },
}

const questionWithValue: CertificateDataElement = {
  id: 'diagnos',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.DIAGNOSIS, list: [{ code: 'F503', description: 'Atypisk bulimia nervosa' }] },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_DIAGNOSES,
    terminology: ['ICD_10', 'Annat'],
    list: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }],
  },
}
const renderDefaultComponent = () => {
  render(
    <>
      <UeDiagnosis question={question} disabled={false} id={'diagnosis'} selectedCodeSystem={CODE_SYSTEM} />
    </>
  )
}

const renderComponentWithValue = () => {
  render(
    <>
      <UeDiagnosis question={questionWithValue} disabled={false} id={'diagnosis'} selectedCodeSystem={CODE_SYSTEM} />
    </>
  )
}

const checkListVisibility = (visible: boolean) => {
  const listItems = screen.queryAllByRole('option')
  if (visible) {
    expect(listItems).toHaveLength(DIAGNOSES.length)
  } else {
    expect(listItems).toHaveLength(0)
  }
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

describe('Diagnosis component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('shows no results and has no values as default', () => {
    renderDefaultComponent()
    const input = screen.queryAllByRole('textbox')
    input.forEach((i: any) => expect(i).toHaveValue(''))
    checkListVisibility(false)
  })

  it('shows results when users types description', () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    checkListVisibility(false)
    userEvent.type(input[1], testInput1)
    checkListVisibility(true)
    expect(input[1]).toHaveValue(testInput1)
    expect(input[0]).toHaveValue('')
    checkListVisibility(true)
  })

  it('shows results when users types code', () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    checkListVisibility(false)
    userEvent.type(input[0], 'f')
    //checkListVisibility(false)
    userEvent.type(input[0], '50')
    checkListVisibility(true)
  })

  it('allows user to choose value from list', () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    checkListVisibility(false)
    userEvent.type(input[1], 'nervosa')
    checkListVisibility(true)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[3])
    checkListVisibility(false)
    expect(input[0]).toHaveValue(DIAGNOSES[3].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[3].beskrivning)
  })

  it('does not allow user to choose short psychological diagnosis', () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    checkListVisibility(false)
    userEvent.type(input[1], 'a')
    checkListVisibility(true)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[0])
    checkListVisibility(false)
    expect(input[0]).toHaveValue('')
    expect(input[1]).toHaveValue('a')
  })

  it('closes list when component does not have focus', async () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    await userEvent.click(input[1])
    await userEvent.type(input[1], testInput1)
    checkListVisibility(true)
    await userEvent.click(input[0])
    checkListVisibility(false)
  })

  it('does not save code input if not selected from results', async () => {
    const exampleCode = 'F501'
    renderDefaultComponent()
    const codeInput = screen.getAllByRole('textbox')[0]
    const descriptionInput = screen.getAllByRole('textbox')[1]
    await userEvent.click(codeInput)
    await userEvent.type(codeInput, exampleCode)
    expect(codeInput).toHaveValue(exampleCode)
    checkListVisibility(true)
    userEvent.click(descriptionInput)
    checkListVisibility(false)
    expect(codeInput).toHaveValue('')

    await userEvent.click(codeInput)
    await userEvent.type(codeInput, exampleCode)
    checkListVisibility(true)
    expect(codeInput).toHaveValue(exampleCode)
    await userEvent.click(screen.queryAllByRole('option')[4])
    checkListVisibility(false)
    expect(codeInput).toHaveValue(DIAGNOSES[4].kod)
  })

  it('does not reset code if escape key is pressed', async () => {
    renderDefaultComponent()
    const input = screen.getAllByRole('textbox')
    await userEvent.click(input[0])
    await userEvent.keyboard(testInput1)
    checkListVisibility(true)
    await userEvent.keyboard('{escape}')
    expect(input[0]).toHaveValue(testInput1)
    checkListVisibility(false)
  })

  it('does not show already chosen values in list', async () => {
    renderComponentWithValue()
    const input = screen.getAllByRole('textbox')
    await userEvent.click(input[0])
    await userEvent.keyboard(testInput1)
    const listItems = screen.queryAllByRole('option')
    expect(listItems).toHaveLength(DIAGNOSES.length - 1)
  })
})
