import { render, screen } from '@testing-library/react'
import React from 'react'
import FMBPanel from './FMBPanel'
import { Wrapper } from '../../feature/certificate/Inputs/DatePickerCustom/Styles'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { fmbMiddleware } from '../../store/fmb/fmbMiddleware'
import { Provider } from 'react-redux'
import { updateFMBDiagnosisCodeInfo } from '../../store/fmb/fmbActions'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <FMBPanel tabIndex={0} selectedTabIndex={0} minimizeSidePanel={<Wrapper />} />
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

    expect(screen.getByLabelText(/Description for A01/i)).toBeDisabled()
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
    renderDefaultComponent()

    expect(screen.getByText('Läs mer om FMB hos Socialstyrelsen').closest('a')).toHaveAttribute(
      'href',
      'https://roi.socialstyrelsen.se/fmb'
    )
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
  }
}

const getEmptyFMBDiagnosisCodeInfoResult = (code: string, index: number) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    index: index,
  }
}
