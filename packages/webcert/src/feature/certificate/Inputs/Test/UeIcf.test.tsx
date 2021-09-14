import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../../../store/reducers'
import { CertificateDataElement, ConfigUeIcf, FMBDiagnosisCodeInfo, ValueIcf } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import UeIcf from '../UeIcf'
import { icfMiddleware } from '../../../../store/icf/icfMiddleware'
import { CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import { IcdCode, IcfCode, IcfState } from '../../../../store/icf/icfReducer'
import { updateIcfCodes } from '../../../../store/icf/icfActions'
import { updateFMBDiagnosisCodeInfo } from '../../../../store/fmb/fmbActions'
import apiMiddleware from '../../../../store/api/apiMiddleware'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = (question: CertificateDataElement, disabled = false) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <UeIcf question={question} disabled={disabled} />
      </Router>
    </Provider>
  )
}

const QUESTION_ID = 'questionid'

const createQuestion = (): CertificateDataElement => {
  return {
    id: QUESTION_ID,
    mandatory: true,
    index: 0,
    parent: '',
    visible: true,
    readOnly: false,
    validation: [],
    validationErrors: [],
    value: { type: CertificateDataValueType.ICF },
    config: {
      id: QUESTION_ID,
      label: 'test',
      modalLabel: 'test',
      collectionsLabel: 'test',
      description: 'test',
      type: ConfigTypes.UE_ICF,
    } as ConfigUeIcf,
  } as CertificateDataElement
}

describe('UeIcf', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, ...icfMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    renderComponent(createQuestion())
  })

  it('shall dispatch updateCertificateDataElement when clicking icf value', () => {
    setDefaultIcfState()
    const icfData = getIcfData()
    const question = createQuestion()
    const expectedIcfValueTitle = icfData.activityLimitation?.commonCodes.icfCodes[0].title
    const expectedValue = {
      id: QUESTION_ID,
      type: CertificateDataValueType.ICF,
      icfCodes: [expectedIcfValueTitle],
      text: '',
    } as ValueIcf

    renderAndOpenDropdown(question)
    question.value = expectedValue

    userEvent.click(screen.getByText(`${expectedIcfValueTitle}`))

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value).toEqual(expectedValue)
  })
})

const renderAndOpenDropdown = (question: CertificateDataElement, disabled = false) => {
  renderComponent(question, disabled)
  setDefaultIcfState()
  toggleIcfDropdown()
}

const setDefaultIcfState = () => {
  const icfData = getIcfData()
  testStore.dispatch(updateIcfCodes(icfData))
  setDefaultFmb()
}

const toggleIcfDropdown = () => {
  userEvent.click(screen.getByText('Ta hjälp av ICF'))
}

const getIcfData = (loading = false): IcfState => {
  const commonIcfCodes: IcfCode[] = [
    {
      code: '0',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '1',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '2',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const uniqueIcfCodes: IcfCode[] = [
    {
      code: '3',
      description: 'description 3',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 3',
    },
    {
      code: '4',
      description: 'description 4',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 4',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: IcdCode[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes: commonIcfCodes, icdCodes: icdCodes },
      uniqueCodes: [{ icfCodes: uniqueIcfCodes, icdCodes: [ICD_CODE_1] }],
    },
    disability: {
      commonCodes: { icfCodes: commonIcfCodes, icdCodes: icdCodes },
      uniqueCodes: [{ icfCodes: uniqueIcfCodes, icdCodes: [ICD_CODE_1] }],
    },
    loading: loading,
  }
}

const setDefaultFmb = () => {
  const codeInfo: FMBDiagnosisCodeInfo = {
    icd10Code: 'A02',
    icd10Description: 'description',
    index: 0,
  }

  testStore.dispatch(updateFMBDiagnosisCodeInfo(codeInfo))
}
