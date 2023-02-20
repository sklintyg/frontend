import { fakeDiagnosesElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it } from 'vitest'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import { getDiagnosisTypeaheadResult } from '../../../../store/utils/utilsSelectors'
import UeDiagnoses from './UeDiagnoses'

let testStore: EnhancedStore

const DIAGNOSES = [
  { kod: 'F501', beskrivning: 'Ätstörningar' },
  { kod: 'F502', beskrivning: 'Anorexia' },
]

const question = fakeDiagnosesElement({
  id: 'id',
  config: {
    terminology: [
      { id: 'ICD_10', label: 'ICD-10' },
      { id: 'Annat', label: 'Annat' },
    ],
  },
})['id']

const renderComponent = ({ ...args }: ComponentProps<typeof UeDiagnoses>) => {
  render(
    <Provider store={testStore}>
      <UeDiagnoses {...args} />
    </Provider>
  )
}

const checkThatInputsAreEmpty = (indexToSkip: number, input: HTMLElement[]) => {
  input.forEach((_, i) => {
    if (i > indexToSkip) {
      expect(i).toHaveValue('')
    }
  })
}

describe('Diagnoses component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([utilsMiddleware])
    testStore.dispatch(updateDiagnosisTypeahead({ diagnoser: DIAGNOSES, resultat: 'OK', moreResults: false }))
  })

  it('Should renders without crashing', () => {
    expect(() => renderComponent({ question, disabled: false })).not.toThrow()
  })

  it('Should have diagnoses in store', () => {
    expect(getDiagnosisTypeaheadResult()(testStore.getState())).toEqual({ diagnoser: DIAGNOSES, resultat: 'OK', moreResults: false })
  })

  it('Should have correct default behaviour', () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[0]).not.toBeDisabled()
    expect(radioButtons[1]).not.toBeDisabled()
    input.forEach((i: HTMLElement) => {
      expect(i).toHaveValue('')
      expect(i).not.toBeDisabled()
    })
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('Should remove values when switching code system', () => {
    renderComponent({ question, disabled: false })
    const radioButtons = screen.queryAllByRole('radio')
    const input = screen.queryAllByRole('textbox')
    userEvent.click(input[1])
    userEvent.type(input[1], 'F50')
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

  it.skip('Should allow user to write values in text boxes', () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    userEvent.click(input[0])
    userEvent.type(input[0], 'F50')
    expect(input[0]).toHaveValue('F50')
    expect(screen.queryAllByRole('list')).toHaveLength(1)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    checkThatInputsAreEmpty(0, input)
    userEvent.click(screen.queryAllByRole('option')[1])
    expect(input[0]).toHaveValue(DIAGNOSES[1].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[1].beskrivning)
    checkThatInputsAreEmpty(1, input)
    userEvent.click(input[5])
    userEvent.type(input[5], 'F50')
    expect(screen.queryAllByRole('list')).toHaveLength(1)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    userEvent.click(screen.queryAllByRole('option')[0])
    expect(input[4]).toHaveValue(DIAGNOSES[0].kod)
    expect(input[5]).toHaveValue(DIAGNOSES[0].beskrivning)
    expect(input[2]).toHaveValue('')
    expect(input[3]).toHaveValue('')
  })
})
