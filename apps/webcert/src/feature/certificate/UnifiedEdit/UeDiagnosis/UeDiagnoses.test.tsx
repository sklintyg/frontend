import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import { getDiagnosisTypeaheadResult } from '../../../../store/utils/utilsSelectors'
import UeDiagnoses from './UeDiagnoses'
import { fakeDiagnosesElement } from '../../../../faker'

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
}).id

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
      await expect(i).toHaveValue('')
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
    await expect(radioButtons[0]).toBeChecked()
    await expect(radioButtons[1]).not.toBeChecked()
    await expect(radioButtons[0]).toBeEnabled()
    await expect(radioButtons[1]).toBeEnabled()
    input.forEach((i: HTMLElement) => {
      await expect(i).toHaveValue('')
      await expect(i).toBeEnabled()
    })
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('Should remove values when switching code system', async () => {
    renderComponent({ question, disabled: false })
    const radioButtons = screen.queryAllByRole('radio')
    const input = screen.queryAllByRole('textbox')
    await userEvent.click(input[1])
    await userEvent.type(input[1], 'F50')
    await userEvent.click(screen.queryAllByRole('option')[0])
    await expect(input[0]).toHaveValue(DIAGNOSES[0].kod)
    await expect(input[1]).toHaveValue(DIAGNOSES[0].beskrivning)
    await expect(radioButtons[0]).toBeChecked()
    await expect(radioButtons[1]).not.toBeChecked()
    await userEvent.click(radioButtons[1])
    await expect(radioButtons[0]).not.toBeChecked()
    await expect(radioButtons[1]).toBeChecked()
    await expect(input[0]).toHaveValue('')
    await expect(input[1]).toHaveValue('')
  })

  it.skip('Should allow user to write values in text boxes', async () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    await userEvent.click(input[0])
    await userEvent.type(input[0], 'F50')
    await expect(input[0]).toHaveValue('F50')
    expect(screen.queryAllByRole('list')).toHaveLength(1)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    checkThatInputsAreEmpty(0, input)
    await userEvent.click(screen.queryAllByRole('option')[1])
    await expect(input[0]).toHaveValue(DIAGNOSES[1].kod)
    await expect(input[1]).toHaveValue(DIAGNOSES[1].beskrivning)
    checkThatInputsAreEmpty(1, input)
    await userEvent.click(input[5])
    await userEvent.type(input[5], 'F50')
    expect(screen.queryAllByRole('list')).toHaveLength(1)
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    await userEvent.click(screen.queryAllByRole('option')[0])
    await expect(input[4]).toHaveValue(DIAGNOSES[0].kod)
    await expect(input[5]).toHaveValue(DIAGNOSES[0].beskrivning)
    await expect(input[2]).toHaveValue('')
    await expect(input[3]).toHaveValue('')
  })
})
