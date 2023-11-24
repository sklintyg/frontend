import { CertificateDataValueType, ValueDiagnosisList } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setDiagnosisListValue, updateFMBDiagnosisCodeInfo } from '../../store/fmb/fmbActions'
import { fmbMiddleware } from '../../store/fmb/fmbMiddleware'
import { updateDynamicLinks } from '../../store/utils/utilsActions'
import FMBPanel from './FMBPanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const getDiagnosisValueWithCodeSystem = (codeSystem: string): ValueDiagnosisList => ({
  type: CertificateDataValueType.DIAGNOSIS_LIST,
  list:
    codeSystem.length === 0
      ? []
      : [
          {
            id: '1',
            type: CertificateDataValueType.DIAGNOSIS,
            code: 'CODE',
            description: 'DESC',
            terminology: codeSystem,
          },
        ],
})

const getFMBDiagnosisCodeInfoResult = (code: string, index: number) => ({
  icd10Code: code,
  icd10Description: `Description for ${code}`,
  diagnosTitle: `diagnosTitle ${code}`,
  forms: [],
  referenceDescription: `referenceDescription ${code}`,
  referenceLink: `referenceLink ${code}`,
  relatedDiagnoses: `relatedDiagnoses ${code}`,
  index,
  originalIcd10Code: code,
  originalIcd10Description: `Description for ${code}`,
})

const getEmptyFMBDiagnosisCodeInfoResult = (code: string, index: number) => ({
  index,
  icd10Code: code,
  icd10Description: `Description for ${code}`,
  originalIcd10Code: code,
  originalIcd10Description: `Description for ${code}`,
})

const getFMBDiagnosisCodeInfoResultWithOtherDiagnosis = (code: string, originalCode: string, index: number) => ({
  icd10Code: code,
  icd10Description: `Description for ${code}`,
  index,

  originalIcd10Code: originalCode,
  originalIcd10Description: `Description for ${originalCode}`,
})

const renderDefaultComponent = () => {
  testStore.dispatch(setDiagnosisListValue(getDiagnosisValueWithCodeSystem('ICD-10-SE')))
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <FMBPanel />
      </Router>
    </Provider>
  )
}

const renderDefaultComponentWithoutDiagnosisValue = () => {
  testStore.dispatch(setDiagnosisListValue(getDiagnosisValueWithCodeSystem('ICD-10-SE')))
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <FMBPanel />
      </Router>
    </Provider>
  )
}

describe('FMBPanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([fmbMiddleware])
  })

  it('shall display empty panel when no diagnoses are selected', async () => {
    renderDefaultComponent()

    expect(screen.getByText(/Ange minst en diagnos för att få FMB-stöd/i)).toBeInTheDocument()
  })

  it('shall display detail panel when diagnosis has FMB recommendation', async () => {
    const fmbDiagnosisCodeInfoResult = getFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()

    expect(screen.queryAllByText(/Vägledning för sjukskrivning/i)).not.toHaveLength(0)
  })

  it('shall display text explaining missing FMB recommendation when diagnosis missing FMB recommendation', async () => {
    const fmbDiagnosisCodeInfoResult = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()

    expect(screen.queryAllByText(/Vägledning för sjukskrivning/i)).toHaveLength(0)
  })

  it('shall display enabled diagnosis description when a diagnosis is selected with FMB recommendation', async () => {
    const fmbDiagnosisCodeInfoResult = getFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()

    expect(screen.getByLabelText(/Description for A01/i)).toBeEnabled()
  })

  it('shall display disabled diagnosis description when a diagnosis is selected and is missing FMB recommendation', async () => {
    const fmbDiagnosisCodeInfoResult = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()

    expect(screen.getByLabelText('Description for A01', { exact: false })).toBeDisabled()
  })

  it('shall select first diagnoses when two diagnoses are selected with FMB recommendation', async () => {
    const fmbDiagnosisCodeInfoResultOne = getFMBDiagnosisCodeInfoResult('A01', 0)
    const fmbDiagnosisCodeInfoResultTwo = getFMBDiagnosisCodeInfoResult('B01', 1)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultOne))
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultTwo))
    renderDefaultComponent()

    expect(screen.getByLabelText(/Description for A01/i)).toBeChecked()
    expect(screen.getByLabelText(/Description for B01/i)).not.toBeChecked()
  })

  it('shall select first diagnoses with FMB recommendations when two diagnoses are selected', async () => {
    const fmbDiagnosisCodeInfoResultOne = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    const fmbDiagnosisCodeInfoResultTwo = getFMBDiagnosisCodeInfoResult('B01', 1)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultOne))
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultTwo))
    renderDefaultComponent()

    expect(screen.getByLabelText(/Description for A01/i)).not.toBeChecked()
    expect(screen.getByLabelText(/Description for B01/i)).toBeChecked()
  })

  it('shall display FMB details of the second diagnoses after the user selects it', async () => {
    const fmbDiagnosisCodeInfoResultOne = getFMBDiagnosisCodeInfoResult('A01', 0)
    const fmbDiagnosisCodeInfoResultTwo = getFMBDiagnosisCodeInfoResult('B01', 1)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultOne))
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultTwo))
    renderDefaultComponent()

    screen.getByLabelText(/Description for B01/i).click()

    expect(screen.getByText(/relatedDiagnoses B01/i)).toBeInTheDocument()
  })

  it('shall display link where to get more information at Socialstyrelsen', async () => {
    const expectedText = 'Läs mer om FMB hos Socialstyrelsen'
    const expectedLink = 'https://roi.socialstyrelsen.se/fmb'
    testStore.dispatch(updateDynamicLinks({ fmbSoc: { text: expectedText, target: '', key: 'fmbSoc', url: expectedLink, tooltip: '' } }))
    renderDefaultComponent()

    expect(screen.getByRole('link', { name: expectedText })).toHaveAttribute('href', expectedLink)
  })

  it('shall show symbol that fmb info is shown for other diagnosis code if fmb result doesnt exist for code', async () => {
    const fmbDiagnosisCodeInfoResult = getFMBDiagnosisCodeInfoResultWithOtherDiagnosis('A01', 'A011', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()
    expect(screen.getByTestId('fmbInfoCircle')).toBeInTheDocument()
  })

  it('shall not show symbol that fmb info is shown for other diagnosis code if fmb result is empty', async () => {
    const fmbDiagnosisCodeInfoResult = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()
    expect(screen.queryByTestId('fmbInfoCircle')).not.toBeInTheDocument()
  })

  it('shall not show symbol that fmb info is shown for other diagnosis code if fmb result exists for code', async () => {
    const fmbDiagnosisCodeInfoResult = getFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()
    expect(screen.queryByTestId('fmbInfoCircle')).not.toBeInTheDocument()
  })

  it('shall display no fmb info exists for diagnoses', async () => {
    const fmbDiagnosisCodeInfoResult = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    const fmbDiagnosisCodeInfoResult2 = getEmptyFMBDiagnosisCodeInfoResult('B01', 1)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult2))
    renderDefaultComponent()

    expect(screen.queryAllByText(/För de angivna diagnoserna finns för tillfället inget FMB-stöd./i)).not.toHaveLength(0)
  })

  it('shall show no fmb support for code system text if different code system than icd10', () => {
    const diagnosisValue = getDiagnosisValueWithCodeSystem('unkown')
    testStore.dispatch(setDiagnosisListValue(diagnosisValue))
    renderDefaultComponentWithoutDiagnosisValue()
    expect(screen.queryByText('FMB-stödet finns enbart för koder som ingår i ICD-10-SE.')).not.toBeInTheDocument()
  })

  it('shall not select diagnosis without fmb support', async () => {
    const fmbDiagnosisCodeInfoResult = getEmptyFMBDiagnosisCodeInfoResult('A01', 0)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResult))
    renderDefaultComponent()
    expect(screen.getByLabelText(/Description for A01/i)).not.toBeChecked()
  })
})
