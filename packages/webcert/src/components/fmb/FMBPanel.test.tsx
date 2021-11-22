import { render, screen } from '@testing-library/react'
import React from 'react'
import FMBPanel from './FMBPanel'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { fmbMiddleware } from '../../store/fmb/fmbMiddleware'
import { Provider } from 'react-redux'
import { updateFMBDiagnosisCodeInfo } from '../../store/fmb/fmbActions'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { updateDynamicLinks } from '../../store/utils/utilsActions'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
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
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(fmbMiddleware),
    })
  })

  it('shall display empty panel when no diagnoses are selected', async () => {
    renderDefaultComponent()

    expect(screen.queryByText(/Ange minst en diagnos för att få FMB-stöd/i)).toBeInTheDocument()
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

  it('shall display enabled diagnosis description when a diagnosis is selected with FMB recommendation ', async () => {
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

  it('shall select first diagnoses when two diagnoses are selected with FMB recommendation ', async () => {
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

  it('shall display FMB details of the second diagnoses after the user selects it ', async () => {
    const fmbDiagnosisCodeInfoResultOne = getFMBDiagnosisCodeInfoResult('A01', 0)
    const fmbDiagnosisCodeInfoResultTwo = getFMBDiagnosisCodeInfoResult('B01', 1)
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultOne))
    testStore.dispatch(updateFMBDiagnosisCodeInfo(fmbDiagnosisCodeInfoResultTwo))
    renderDefaultComponent()

    screen.getByLabelText(/Description for B01/i).click()

    expect(screen.queryByText(/relatedDiagnoses B01/i)).toBeInTheDocument()
  })

  it('shall display link where to get more information at Socialstyrelsen', async () => {
    const expectedText = 'Läs mer om FMB hos Socialstyrelsen'
    const expectedLink = 'https://roi.socialstyrelsen.se/fmb'
    testStore.dispatch(updateDynamicLinks({ fmbSoc: { text: expectedText, target: '', key: 'fmbSoc', url: expectedLink, tooltip: '' } }))
    renderDefaultComponent()

    expect(screen.getByText(expectedText).closest('a')).toHaveAttribute('href', expectedLink)
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
})

const getFMBDiagnosisCodeInfoResult = (code: string, index: number) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    diagnosTitle: 'diagnosTitle ' + code,
    forms: [],
    referenceDescription: 'referenceDescription ' + code,
    referenceLink: 'referenceLink ' + code,
    relatedDiagnoses: 'relatedDiagnoses ' + code,
    index: index,
    originalIcd10Code: code,
    originalIcd10Description: 'Description for ' + code,
  }
}

const getEmptyFMBDiagnosisCodeInfoResult = (code: string, index: number) => {
  return {
    index: index,
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    originalIcd10Code: code,
    originalIcd10Description: 'Description for ' + code,
  }
}

const getFMBDiagnosisCodeInfoResultWithOtherDiagnosis = (code: string, originalCode: string, index: number) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    index: index,

    originalIcd10Code: originalCode,
    originalIcd10Description: 'Description for ' + originalCode,
  }
}
