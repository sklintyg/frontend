import { fakeDiagnosesElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import * as redux from 'react-redux'
import store from '../../../../store/store'
import UeDiagnosis from './UeDiagnosis'

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

const renderComponent = ({ ...args }: ComponentProps<typeof UeDiagnosis>) => {
  return render(
    <redux.Provider store={store}>
      <UeDiagnosis {...args} />
    </redux.Provider>
  )
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
  it('Should renders without crashing', () => {
    expect(() =>
      renderComponent({
        question: fakeDiagnosesElement({ id: 'id' })['id'],
        disabled: false,
        id: 'id',
        selectedCodeSystem: 'ICD_10',
        validationErrors: [],
      })
    ).not.toThrow()
  })

  it('Should show no results and has no values as default', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.queryAllByRole('textbox')
    input.forEach((i: HTMLElement) => expect(i).toHaveValue(''))
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should show results when users types description', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(input[1], 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    expect(input[1]).toHaveValue('ä')
    expect(input[0]).toHaveValue('')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should show results when users types code', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(input[0], 'f')
    //expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(input[0], '50')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should allow user to choose value from list', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(input[1], 'nervosa')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[3])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(input[0]).toHaveValue(DIAGNOSES[3].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[3].beskrivning)
  })

  it('Should not allow user to choose short psychological diagnosis', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(input[1], 'a')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[0])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(input[0]).toHaveValue('')
    expect(input[1]).toHaveValue('a')
  })

  it('Should close list when component does not have focus', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    userEvent.click(input[1])
    userEvent.type(input[1], 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    userEvent.click(input[0])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should not save code input if not selected from results', () => {
    const exampleCode = 'F501'
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const codeInput = screen.getAllByRole('textbox')[0]
    const descriptionInput = screen.getAllByRole('textbox')[1]
    userEvent.click(codeInput)
    userEvent.type(codeInput, exampleCode)
    expect(codeInput).toHaveValue(exampleCode)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    userEvent.click(descriptionInput)
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(codeInput).toHaveValue('')

    userEvent.click(codeInput)
    userEvent.type(codeInput, exampleCode)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    expect(codeInput).toHaveValue(exampleCode)
    userEvent.click(screen.queryAllByRole('option')[4])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(codeInput).toHaveValue(DIAGNOSES[4].kod)
  })

  it('Should not reset code if escape key is pressed', () => {
    renderComponent({
      question: fakeDiagnosesElement({ id: 'id' })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    userEvent.click(input[0])
    userEvent.keyboard('ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    userEvent.keyboard('{escape}')
    expect(input[0]).toHaveValue('ä')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should not show already chosen values in list', () => {
    renderComponent({
      question: fakeDiagnosesElement({
        id: 'id',
        value: {
          list: [{ code: 'F503', description: 'Atypisk bulimia nervosa' }],
        },
      })['id'],
      disabled: false,
      id: 'id',
      selectedCodeSystem: 'ICD_10',
      validationErrors: [],
    })
    const input = screen.getAllByRole('textbox')
    userEvent.click(input[0])
    userEvent.keyboard('ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length - 1)
  })
})
