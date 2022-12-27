import { CertificateDataElement, ConfigUeIcf, FMBDiagnosisCodeInfo, ValueIcf } from '@frontend/common'
import { CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React, { createRef } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { getIcfData } from '../../../../components/icf/icfTestUtils'
import apiMiddleware from '../../../../store/api/apiMiddleware'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { updateFMBDiagnosisCodeInfo } from '../../../../store/fmb/fmbActions'
import { setOriginalIcd10Codes, updateIcfCodes } from '../../../../store/icf/icfActions'
import { icfMiddleware } from '../../../../store/icf/icfMiddleware'
import reducer from '../../../../store/reducers'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import { CertificateContext } from '../../CertificateContext'
import UeIcf from '../UeIcf'

let testStore: EnhancedStore
const history = createMemoryHistory()
window.scrollTo = jest.fn()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const mockContext = { certificateContainerId: '', certificateContainerRef: createRef<HTMLDivElement>() }

const renderComponent = (question: CertificateDataElement, disabled = false) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <CertificateContext.Provider value={mockContext}>
          <UeIcf question={question} disabled={disabled} />
        </CertificateContext.Provider>
      </Router>
    </Provider>
  )
}

const QUESTION_ID = 'questionid'
const PLACEHOLDER = 'placeholder'

describe('UeIcf', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern')
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, icfMiddleware),
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
    const expectedValue = createValue([expectedIcfValueTitle!], '')

    renderAndOpenDropdown(question)
    userEvent.click(screen.getByText(`${expectedIcfValueTitle}`))
    jest.advanceTimersByTime(2000)

    flushPromises()
    const actions = dispatchedActions.filter((action) => updateCertificateDataElement.match(action))
    const updateCertificateDataElementAction = actions[actions.length - 1]
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual(expectedValue.icfCodes)
  })

  it('shall dispatch updateCertificateDataElement when entering text value', () => {
    setDefaultIcfState()
    const question = createQuestion()
    renderComponent(question)
    const expectedTextValue = 'Det här är ett meddelande'

    const messageField = screen.getByRole('textbox')
    userEvent.type(messageField, expectedTextValue)
    jest.advanceTimersByTime(2000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.text).toEqual(expectedTextValue)
  })

  it('shall dispatch updateCertificateDataElement and clear chosen values when fetching updated empty icf data', () => {
    setDefaultIcfState()
    const initialValues = ['1', '2', '3']
    const question = createQuestion(initialValues)
    renderComponent(question)

    testStore.dispatch(updateIcfCodes({ disability: undefined, activityLimitation: undefined }))
    jest.advanceTimersByTime(10000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual([])
  })

  it('shall dispatch updateCertificateDataElement and filter chosen values when fetching updated icf data', () => {
    setDefaultIcfState()
    const icfData = getIcfData()
    const icfCodes = icfData.disability?.commonCodes.icfCodes
    const initialValues = [icfCodes![0].title, icfCodes![1].title, icfCodes![2].title]
    const expectedValues = [icfCodes![0].title, icfCodes![1].title]
    const question = createQuestion(initialValues)
    renderComponent(question)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icfData.disability!.commonCodes.icfCodes = [{ title: icfCodes![0].title }, { title: icfCodes![1].title }]
    testStore.dispatch(updateIcfCodes(icfData))
    jest.advanceTimersByTime(10000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual(expectedValues)
  })

  it('shall not display placeholder if no chosen icf values', () => {
    const question = createQuestion()
    renderComponent(question)

    expect(screen.queryByText(PLACEHOLDER)).not.toBeInTheDocument()
  })

  it('shall display placeholder if chosen icf values', () => {
    const question = createQuestion(['test'])
    renderComponent(question)
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeInTheDocument()
  })

  it('shall display button when question is enabled', () => {
    const question = createQuestion()
    renderComponent(question, false)
    expect(screen.getByText('Ta hjälp av ICF')).toBeInTheDocument()
  })

  it('shall not display button when question is disabled', () => {
    const question = createQuestion()
    renderComponent(question, true)
    expect(screen.queryByText('Ta hjälp av ICF')).not.toBeInTheDocument()
  })
})

const createQuestion = (icfCodes?: string[]): CertificateDataElement => {
  return {
    id: QUESTION_ID,
    mandatory: true,
    index: 0,
    parent: '',
    visible: true,
    readOnly: false,
    validation: [],
    validationErrors: [],
    value: { type: CertificateDataValueType.ICF, icfCodes: icfCodes } as ValueIcf,
    config: {
      id: QUESTION_ID,
      label: 'test',
      modalLabel: 'test',
      collectionsLabel: 'test',
      description: 'test',
      type: ConfigTypes.UE_ICF,
      placeholder: PLACEHOLDER,
    } as ConfigUeIcf,
  } as CertificateDataElement
}

const createValue = (icfCodes: string[], text: string) => {
  return {
    id: QUESTION_ID,
    type: CertificateDataValueType.ICF,
    icfCodes: icfCodes,
    text: text,
  } as ValueIcf
}

const renderAndOpenDropdown = (question: CertificateDataElement, disabled = false) => {
  renderComponent(question, disabled)
  setDefaultIcfState()
  toggleIcfDropdown()
}

const setDefaultIcfState = () => {
  const icfData = getIcfData()
  testStore.dispatch(updateIcfCodes(icfData))
  updateOriginalIcd10Codes()
  setDefaultFmb()
}

const toggleIcfDropdown = () => {
  userEvent.click(screen.getByText('Ta hjälp av ICF'))
}

const setDefaultFmb = () => {
  const codeInfo: FMBDiagnosisCodeInfo = {
    icd10Code: 'A02',
    icd10Description: 'description',
    index: 0,
  }

  testStore.dispatch(updateFMBDiagnosisCodeInfo(codeInfo))
}

const updateOriginalIcd10Codes = () => {
  const codeInfo: string[] = ['A02', 'U071']

  testStore.dispatch(setOriginalIcd10Codes(codeInfo))
}
