import { fakeDiagnosesElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import * as redux from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
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

let testStore: EnhancedStore

const renderComponent = ({ ...args }: Partial<ComponentProps<typeof UeDiagnosis>>) => {
  return render(
    <redux.Provider store={testStore}>
      <UeDiagnosis
        question={fakeDiagnosesElement({ id: 'id' })['id']}
        disabled={false}
        id={'id'}
        selectedCodeSystem={'ICD_10'}
        validationErrors={[]}
        hasValidationError={false}
        {...args}
      />
    </redux.Provider>
  )
}

describe('Diagnosis component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([utilsMiddleware, certificateMiddleware])
    testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false }))
  })

  it('Should renders without crashing', () => {
    expect(() => renderComponent({})).not.toThrow()
  })

  it('Should show no results and has no values as default', () => {
    renderComponent({})
    const input = screen.queryAllByRole('textbox')
    input.forEach((i: HTMLElement) => expect(i).toHaveValue(''))
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should show results when users types description', () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    expect(screen.getByTestId('id-diagnos')).toHaveValue('ä')
    expect(screen.getByTestId('id-code')).toHaveValue('')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should show results when users types code', () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(screen.getByTestId('id-code'), 'f')
    testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false }))
    userEvent.type(screen.getByTestId('id-code'), '50')
    testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false }))
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should allow user to choose value from list', () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(screen.getByTestId('id-diagnos'), 'nervosa')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[3])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByTestId('id-code')).toHaveValue(DIAGNOSES[3].kod)
    expect(screen.getByTestId('id-diagnos')).toHaveValue(DIAGNOSES[3].beskrivning)
  })

  it('Should not allow user to choose short psychological diagnosis', () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    userEvent.type(screen.getByTestId('id-diagnos'), 'a')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    userEvent.click(items[0])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByTestId('id-code')).toHaveValue('')
    expect(screen.getByTestId('id-diagnos')).toHaveValue('a')
  })

  it('Should close list when component does not have focus', () => {
    renderComponent({})

    userEvent.click(screen.getByTestId('id-diagnos'))
    userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    userEvent.click(screen.getByTestId('id-code'))
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
    })
    userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length - 1)
  })
})
