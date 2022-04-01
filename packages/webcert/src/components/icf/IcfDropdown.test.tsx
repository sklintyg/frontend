import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React, { createRef, useRef } from 'react'
import reducer from '../../store/reducers'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../../store/api/apiMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import IcfDropdown from './IcfDropdown'
import { icfMiddleware } from '../../store/icf/icfMiddleware'
import { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { setOriginalIcd10Codes, updateIcfCodes } from '../../store/icf/icfActions'
import userEvent from '@testing-library/user-event'
import { getIcfData } from './icfTestUtils'
import { CertificateContext } from '../../feature/certificate/CertificateContext'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const COLLECTIONS_LABEL = 'collectionsLabel'

const mockContext = { certificateContainerId: '', certificateContainerRef: createRef<HTMLDivElement>() }

const renderComponent = (
  infoText = 'infoText test',
  icfData = getIcfData().activityLimitation,
  icfValues = getIcfValues(),
  disabled = false
) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <CertificateContext.Provider value={mockContext}>
          <IcfDropdown
            modalLabel={infoText}
            icfData={icfData!}
            chosenIcfCodeValues={icfValues}
            collectionsLabel={COLLECTIONS_LABEL}
            disabled={disabled}
            onAddCode={() => {}}
            onRemoveCode={() => {}}
          />
        </CertificateContext.Provider>
      </Router>
    </Provider>
  )
}

describe('IcfDropdown', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, icfMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  it('display disabled button if no icd codes', () => {
    renderComponent()

    expect(screen.getByText('Ta hjälp av ICF')).toBeDisabled()
  })

  it('display disabled button if disabled prop is true', () => {
    renderComponent(undefined, undefined, undefined, true)
    setDefaultIcfState()

    expect(screen.getByText('Ta hjälp av ICF')).toBeDisabled()
  })

  xit('display tooltip if no icd codes', () => {
    renderComponent()
    const expected = 'Ange minst en diagnos för att få ICF-stöd'

    userEvent.hover(screen.getByText('Ta hjälp av ICF'))

    expect(screen.queryByText(expected)).not.toBeNull()
  })

  it('display enabled button if icd codes exist', () => {
    renderComponent()
    setDefaultIcfState()

    expect(screen.getByText('Ta hjälp av ICF')).toBeEnabled()
  })

  it('display no infoText before ICF button is clicked', () => {
    const expected = 'Välj enbart de problem som påverkar patienten.'
    renderComponent(expected)
    setDefaultIcfState()

    expect(screen.queryByText(expected)).not.toBeInTheDocument()
  })

  it('display infoText after ICF button is clicked', () => {
    const expected = 'Välj enbart de problem som påverkar patienten.'
    renderAndOpenDropdown(expected)

    expect(screen.getByText(expected)).toBeVisible()
  })

  it('display icd codes after ICF button is clicked', () => {
    const icfData = getIcfData()
    renderAndOpenDropdown()
    expect(screen.getAllByText(icfData.activityLimitation!.commonCodes.icd10Codes[0].title)[0]).toBeInTheDocument()
    expect(screen.getAllByText(icfData.activityLimitation!.commonCodes.icd10Codes[1].title)[0]).toBeInTheDocument()
  })

  it('display common icd codes after ICF button is clicked', () => {
    const expected = 'ICF-kategorier gemensamma för:'
    renderAndOpenDropdown()

    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('display unique icd codes after ICF button is clicked', () => {
    const expected = 'ICF-kategorier för:'
    renderAndOpenDropdown()

    expect(screen.getAllByText(expected)[0]).toBeInTheDocument()
  })

  it('display description when expanding show more', () => {
    const icfData = getIcfData()
    const sut = icfData.activityLimitation?.commonCodes.icfCodes[0]
    const expected = sut?.description
    renderAndOpenDropdown()

    userEvent.click(screen.getAllByTestId(sut!.title + '-showmore')[0])

    expect(screen.getByText(expected!)).toBeInTheDocument()
  })

  it('hides description when expanding and de-expanding show more', () => {
    const icfData = getIcfData()
    const sut = icfData.activityLimitation?.commonCodes.icfCodes[0]
    const expected = sut?.description
    renderAndOpenDropdown()

    userEvent.click(screen.getAllByTestId(sut!.title + '-showmore')[0])
    userEvent.click(screen.getAllByTestId(sut!.title + '-showmore')[0])

    expect(screen.queryByText(expected!)).not.toBeInTheDocument()
  })

  it('display link in footer to socialstyrelsen', () => {
    renderAndOpenDropdown()

    expect(screen.getByText('Läs mer om ICF hos Socialstyrelsen')).toBeInTheDocument()
    expect(screen.getByText('Läs mer om ICF hos Socialstyrelsen')).toHaveAttribute(
      'href',
      'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf'
    )
  })

  it('shall display close button in modal', () => {
    renderAndOpenDropdown()

    expect(screen.getByRole('button', { name: /stäng/i }))
  })

  it('checkbox is checked if icf id is passed to component', () => {
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)

    expect(screen.getByRole('checkbox', { name: icfData.activityLimitation?.commonCodes.icfCodes[0].title })).toBeChecked()
  })

  it('shall display chosen values', () => {
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    updateOriginalIcd10Codes()
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    icfValues?.forEach((value) => {
      const valueTitle = screen.getByText(value)
      expect(valueTitle).toBeVisible()
    })
  })

  it('shall display collections label', () => {
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    updateOriginalIcd10Codes()
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    expect(screen.getByText(COLLECTIONS_LABEL)).toBeInTheDocument()
  })

  it('shall display chosen values if no icd codes', () => {
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    icfValues?.forEach((value) => {
      const valueTitle = screen.getByText(value)
      expect(valueTitle).toBeVisible()
    })
  })

  it('shall show info symbol that support is for another icd10 code', () => {
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)
    testStore.dispatch(setOriginalIcd10Codes(['A02'])) // remove one original code
    expect(screen.queryByTestId('originalWarningIcf')).toBeInTheDocument()
  })

  it('shall not show info symbol that support exists for another icd10 code', () => {
    const icfData = getIcfData()
    updateOriginalIcd10Codes()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)
    expect(screen.queryByTestId('originalWarningIcf')).not.toBeInTheDocument()
  })

  it('should close dropdown on escape press', () => {
    const expectedText = 'Test'
    const icfData = getIcfData()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(expectedText, icfData.activityLimitation, icfValues)
    userEvent.keyboard('{escape}')
    expect(screen.queryByText(expectedText)).not.toBeInTheDocument()
  })
})

const renderAndOpenDropdown = (title?: string, icfData?: AvailableIcfCodes, icfValues?: string[]) => {
  renderComponent(title, icfData, icfValues)
  setDefaultIcfState()
  toggleIcfDropdown()
}

const setDefaultIcfState = () => {
  const icfData = getIcfData()
  testStore.dispatch(updateIcfCodes(icfData))
  updateOriginalIcd10Codes()
}

const toggleIcfDropdown = () => {
  userEvent.click(screen.getByText('Ta hjälp av ICF'))
}

const getIcfValues = () => {
  return ['1', '2']
}

const updateOriginalIcd10Codes = () => {
  const codeInfo: string[] = ['A02', 'U071']

  testStore.dispatch(setOriginalIcd10Codes(codeInfo))
}
