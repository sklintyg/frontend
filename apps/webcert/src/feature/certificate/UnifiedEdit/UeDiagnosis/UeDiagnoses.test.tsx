import type { EnhancedStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act, type ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificateConfig, fakeCertificateValue, fakeDiagnosesElement } from '../../../../faker'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { utilsMiddleware } from '../../../../store/utils/utilsMiddleware'
import { getDiagnosisTypeaheadResult } from '../../../../store/utils/utilsSelectors'
import { UeDiagnoses } from './UeDiagnoses'

let testStore: EnhancedStore

const DIAGNOSES = [
  { kod: 'F501', beskrivning: 'Ätstörningar' },
  { kod: 'F500', beskrivning: 'Anorexia nervosa' },
  { kod: 'F501', beskrivning: 'Atypisk anorexia nervosa' },
  { kod: 'F502', beskrivning: 'Bulimia nervosa' },
  { kod: 'F503', beskrivning: 'Atypisk bulimia nervosa' },
  { kod: 'F504', beskrivning: 'Överdrivet ätande sammanhängande med andra psykiska störningar' },
  { kod: 'F505', beskrivning: 'Kräkningar sammanhängande med andra psykiska störningar' },
  { kod: 'F508', beskrivning: 'Andra specificerade ätstörningar' },
  { kod: 'F509', beskrivning: 'Ätstörning, ospecificerad' },
]

const question = fakeDiagnosesElement({
  id: 'id',
  config: fakeCertificateConfig.diagnoses({
    list: [{ id: 'id' }],
    terminology: [
      {
        id: 'ICD_10_SE',
        label: 'ICD-10-SE',
      },
      {
        id: 'KSH_97_P',
        label: 'KSH97-P (Primärvård)',
      },
    ],
  }),
  value: {
    list: [fakeCertificateValue.diagnosis({ id: 'id' })],
  },
}).id

const renderComponent = ({ ...args }: Partial<ComponentProps<typeof UeDiagnoses>>) =>
  render(
    <Provider store={testStore}>
      <UeDiagnoses
        question={question}
        disabled={false}
        onUpdate={(value) => testStore.dispatch(updateCertificateDataElement({ ...question, value }))}
        {...args}
      />
    </Provider>
  )

describe('Diagnoses component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware, utilsMiddleware])
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
    await userEvent.click(screen.getByTestId('id-diagnos'))
    await userEvent.type(screen.getByTestId('id-diagnos'), 'F50')
    await userEvent.click(screen.queryAllByRole('option')[0])
    expect(screen.getByTestId('id-code')).toHaveValue(DIAGNOSES[0].kod)
    expect(screen.getByTestId('id-diagnos')).toHaveValue(DIAGNOSES[0].beskrivning)

    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    await userEvent.click(radioButtons[1])
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).toBeChecked()
    await waitFor(() => expect(screen.getByTestId('id-code')).toHaveValue(''))
    expect(screen.getByTestId('id-diagnos')).toHaveValue('')
  })

  it('Should show no results and has no values as default', () => {
    renderComponent({})
    const input = screen.queryAllByRole('textbox')
    input.forEach((i: HTMLElement) => expect(i).toHaveValue(''))
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should show results when users types description', async () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    await expect(screen.getByTestId('id-diagnos')).toHaveValue('ä')
    await expect(screen.getByTestId('id-code')).toHaveValue('')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should show results when users types code', async () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await userEvent.type(screen.getByTestId('id-code'), 'f')
    await act(async () => testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false })))
    await userEvent.type(screen.getByTestId('id-code'), '50')
    await act(async () => testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false })))
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
  })

  it('Should allow user to choose value from list', async () => {
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await userEvent.type(screen.getByTestId('id-diagnos'), 'nervosa')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(DIAGNOSES.length)
    await userEvent.click(items[3])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await expect(screen.getByTestId('id-code')).toHaveValue(DIAGNOSES[3].kod)
    await expect(screen.getByTestId('id-diagnos')).toHaveValue(DIAGNOSES[3].beskrivning)
  })

  it('Should not allow user to choose short psychological diagnosis', async () => {
    testStore.dispatch(
      updateDiagnosisTypeahead({
        diagnoser: [
          { kod: 'F50', beskrivning: 'Ätstörningar' },
          { kod: 'F502', beskrivning: 'Anorexia' },
        ],
        resultat: 'OK',
        moreResults: false,
      })
    )
    renderComponent({})
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await userEvent.type(screen.getByTestId('id-diagnos'), 'a')
    expect(screen.queryAllByRole('option')).toHaveLength(2)
    const items = screen.getAllByRole('option')
    expect(items).toHaveLength(2)
    await userEvent.click(items[0])
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByTestId('id-code')).toHaveValue('')
    expect(screen.getByTestId('id-diagnos')).toHaveValue('a')
  })

  it('Should close list when component does not have focus', async () => {
    renderComponent({})

    await userEvent.click(screen.getByTestId('id-diagnos'))
    await userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length)
    await userEvent.click(screen.getByTestId('id-code'))
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('Should not show already chosen values in list', async () => {
    renderComponent({
      question: fakeDiagnosesElement({
        id: 'id',
        config: fakeCertificateConfig.diagnoses({
          list: [{ id: 'id' }],
          terminology: [
            {
              id: 'ICD_10_SE',
              label: 'ICD-10-SE',
            },
            {
              id: 'KSH_97_P',
              label: 'KSH97-P (Primärvård)',
            },
          ],
        }),
        value: {
          list: [{ id: 'id', code: 'F503', description: 'Atypisk bulimia nervosa' }],
        },
      }).id,
    })
    await userEvent.type(screen.getByTestId('id-diagnos'), 'ä')
    expect(screen.queryAllByRole('option')).toHaveLength(DIAGNOSES.length - 1)
  })

  it('Should reset code when losing focus', async () => {
    renderComponent({})
    await userEvent.type(screen.getByTestId('id-code'), 'abc')
    fireEvent.blur(screen.getByTestId('id-code'))
    expect(screen.getByTestId('id-code')).toHaveValue('')
  })

  it('Should reset code when removing description', async () => {
    renderComponent({})
    await userEvent.type(screen.getByTestId('id-code'), 'F50')
    await act(async () => testStore.dispatch(updateDiagnosisTypeahead({ resultat: 'OK', diagnoser: DIAGNOSES, moreResults: false })))
    const items = screen.getAllByRole('option')
    await userEvent.click(items[0])
    await waitFor(() => expect(screen.getByTestId('id-code')).toHaveValue('F501'))
    await userEvent.clear(screen.getByTestId('id-diagnos'))
    expect(screen.getByTestId('id-code')).toHaveValue('')
  })
})
