import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeDiagnosesElement } from '../../../../faker'
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
}).id

const renderComponent = ({ ...args }: ComponentProps<typeof UeDiagnoses>) => {
  render(
    <Provider store={testStore}>
      <UeDiagnoses {...args} />
    </Provider>
  )
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

  it('Should have correct default behaviour', async () => {
    renderComponent({ question, disabled: false })
    const input = screen.queryAllByRole('textbox')
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[0]).toBeEnabled()
    expect(radioButtons[1]).toBeEnabled()
    input.forEach(async (i: HTMLElement) => {
      expect(i).toHaveValue('')
      expect(i).toBeEnabled()
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
    expect(input[0]).toHaveValue(DIAGNOSES[0].kod)
    expect(input[1]).toHaveValue(DIAGNOSES[0].beskrivning)
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    await userEvent.click(radioButtons[1])
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).toBeChecked()
    await waitFor(() => expect(input[0]).toHaveValue(''))
    expect(input[1]).toHaveValue('')
  })
})
