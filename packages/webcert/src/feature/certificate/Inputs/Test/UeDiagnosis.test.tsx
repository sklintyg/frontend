import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeDiagnosis from '../UeDiagnosis'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CODE_SYSTEM = 'ICD_10'
const DIAGNOSES = [
  { kod: 'F50', beskrivning: 'Ätstörningar' },
  { kod: 'F501', beskrivning: 'Anorexia' },
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
const renderDefaultComponent = () => {
  render(
    <>
      <UeDiagnosis question={question} disabled={false} id={'diagnosis'} selectedCodeSystem={CODE_SYSTEM} />
    </>
  )
}

const checkListVisibility = (visible: boolean) => {
  const list = screen.queryAllByRole('list')
  const listItem = screen.queryAllByRole('option')
  if (visible) {
    expect(list).not.toBeNull()
    expect(list).toHaveLength(1)
    expect(listItem).not.toBeNull()
    expect(listItem.length > 0).toBeTruthy()
  } else {
    expect(list).toHaveLength(0)
    expect(listItem).toHaveLength(0)
  }
}

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
useSelectorSpy.mockReturnValue({
  diagnoser: DIAGNOSES,
  resultat: 'OK',
})
useDispatchSpy.mockReturnValue(jest.fn())

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
    userEvent.click(items[0])
    checkListVisibility(false)
    expect(input[0]).toHaveValue(DIAGNOSES[0].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[0].beskrivning)
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
    await userEvent.click(screen.queryAllByRole('option')[0])
    checkListVisibility(false)
    expect(codeInput).toHaveValue(DIAGNOSES[0].kod)
  })
})
