import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { last } from 'lodash-es'
import { ComponentProps, createRef } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeCertificateValue, fakeICFDataElement, fakeIcf } from '../../../../faker'
import { apiMiddleware } from '../../../../store/api/apiMiddleware'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateFMBDiagnosisCodeInfo } from '../../../../store/fmb/fmbActions'
import { setOriginalIcd10Codes, updateIcfCodes } from '../../../../store/icf/icfActions'
import { icfMiddleware } from '../../../../store/icf/icfMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import { CertificateDataElement } from '../../../../types'
import { flushPromises } from '../../../../utils/flushPromises'
import { CertificateContext } from '../../CertificateContext'
import UeIcf from './UeIcf'

const QUESTION_ID = 'questionid'
const PLACEHOLDER = 'placeholder'

let testStore: EnhancedStore
const history = createMemoryHistory()
Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() })

const mockContext = { certificateContainerId: '', certificateContainerRef: createRef<HTMLDivElement>() }

const renderComponent = (props: ComponentProps<typeof UeIcf>) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <CertificateContext.Provider value={mockContext}>
          <UeIcf {...props} />
        </CertificateContext.Provider>
      </Router>
    </Provider>
  )
}

const createQuestion = (icfCodes?: string[]): CertificateDataElement =>
  fakeICFDataElement({
    id: QUESTION_ID,
    value: { icfCodes },
    config: {
      id: QUESTION_ID,
      label: 'test',
      modalLabel: 'test',
      collectionsLabel: 'test',
      description: 'test',
      placeholder: PLACEHOLDER,
    },
  })[QUESTION_ID]

const setDefaultIcfState = () => {
  const group = fakeIcf.group({ icfCodes: Array.from({ length: 3 }, (_, index) => fakeIcf.code({ title: `title ${index}` })) })
  testStore.dispatch(
    updateIcfCodes({
      activityLimitation: fakeIcf.collection({ commonCodes: group, uniqueCodes: [group] }),
      disability: fakeIcf.collection({ commonCodes: group, uniqueCodes: [group] }),
    })
  )
  testStore.dispatch(setOriginalIcd10Codes(['A02', 'U071']))
  testStore.dispatch(
    updateFMBDiagnosisCodeInfo({
      icd10Code: 'A02',
      icd10Description: 'description',
      index: 0,
    })
  )
}

// Scroll library used is not working properly in jsdom
describe.skip('UeIcf', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, icfMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent({ question: createQuestion(), disabled: false })).not.toThrow()
  })

  it('Should dispatch updateCertificateDataElement when clicking icf value', async () => {
    setDefaultIcfState()

    const question = createQuestion()
    const expectedIcfValueTitle = 'title 0'
    const expectedValue = fakeCertificateValue.icf({ icfCodes: [expectedIcfValueTitle], text: '' })

    renderComponent({ question, disabled: false })
    await userEvent.click(screen.getByText('Ta hjälp av ICF'))

    await userEvent.click(screen.getByLabelText(expectedIcfValueTitle))
    vi.advanceTimersByTime(2000)

    flushPromises()
    const updateCertificateDataElementAction = last(dispatchedActions.filter((action) => updateCertificateDataElement.match(action)))
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual(expectedValue.icfCodes)
  })

  it('Should dispatch updateCertificateDataElement when entering text value', async () => {
    setDefaultIcfState()
    const question = createQuestion()
    renderComponent({ question, disabled: false })
    const expectedTextValue = 'Det här är ett meddelande'

    const messageField = screen.getByRole('textbox')
    await userEvent.type(messageField, expectedTextValue)
    vi.advanceTimersByTime(2000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.text).toEqual(expectedTextValue)
  })

  it.skip('Should dispatch updateCertificateDataElement and clear chosen values when fetching updated empty icf data', () => {
    setDefaultIcfState()
    const initialValues = ['1', '2', '3']
    const question = createQuestion(initialValues)
    renderComponent({ question, disabled: false })

    testStore.dispatch(updateIcfCodes({ disability: undefined, activityLimitation: undefined }))
    vi.advanceTimersByTime(10000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual([])
  })

  it.skip('Should dispatch updateCertificateDataElement and filter chosen values when fetching updated icf data', () => {
    setDefaultIcfState()
    const newIcfGroup = fakeIcf.group({ icfCodes: Array.from({ length: 2 }, (_, index) => fakeIcf.code({ title: `title ${index}` })) })
    const initialValues = ['title 0', 'title 1', 'title 2']
    const expectedValues = ['title 0', 'title 1']
    const question = createQuestion(initialValues)
    renderComponent({ question, disabled: false })

    testStore.dispatch(
      updateIcfCodes({
        disability: { commonCodes: newIcfGroup, uniqueCodes: [newIcfGroup] },
        activityLimitation: { commonCodes: newIcfGroup, uniqueCodes: [newIcfGroup] },
      })
    )
    vi.advanceTimersByTime(10000)

    flushPromises()
    const updateCertificateDataElementAction = dispatchedActions.find((action) => updateCertificateDataElement.match(action))
    expect(updateCertificateDataElementAction?.payload.value.icfCodes).toEqual(expectedValues)
  })

  it('Should not display placeholder if no chosen icf values', () => {
    const question = createQuestion()
    renderComponent({ question, disabled: false })

    expect(screen.queryByText(PLACEHOLDER)).not.toBeInTheDocument()
  })

  it('Should display placeholder if chosen icf values', () => {
    const question = createQuestion(['test'])
    renderComponent({ question, disabled: false })
    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeInTheDocument()
  })

  it('Should display button when question is enabled', () => {
    const question = createQuestion()
    renderComponent({ question, disabled: false })
    expect(screen.getByText('Ta hjälp av ICF')).toBeInTheDocument()
  })

  it('Should not display button when question is disabled', () => {
    const question = createQuestion()
    renderComponent({ question, disabled: true })
    expect(screen.queryByText('Ta hjälp av ICF')).not.toBeInTheDocument()
  })
})
