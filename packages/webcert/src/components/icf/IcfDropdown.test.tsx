import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import apiMiddleware from '../../store/api/apiMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import IcfDropdown from './IcfDropdown'
import { icfMiddleware } from '../../store/icf/icfMiddleware'
import { IcdCode, Icf, IcfCode, IcfState } from '../../store/icf/icfReducer'
import { updateIcfCodes } from '../../store/icf/icfActions'
import userEvent from '@testing-library/user-event'
import { updateFMBDiagnosisCodeInfo } from '../../store/fmb/fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const history = createMemoryHistory()

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = (infoText = 'infoText test', icfData = getIcfData().activityLimitation) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <IcfDropdown infoText={infoText} icfData={icfData!} />
      </Router>
    </Provider>
  )
}

describe('IcfDropdown', () => {
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
    renderComponent()
  })

  it('display disabled button if no icd codes', () => {
    renderComponent()

    expect(screen.getByText('Ta hjälp av ICF')).toBeDisabled()
  })

  it('display tooltip if no icd codes', () => {
    renderComponent()
    const expected = 'Ange minst en diagnos för att få ICF-stöd'

    userEvent.hover(screen.getByText('Ta hjälp av ICF'))

    expect(screen.getByText(expected)).toBeInTheDocument()
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

    expect(screen.getByText(expected)).not.toBeVisible()
  })

  it('display infoText after ICF button is clicked', () => {
    const expected = 'Välj enbart de problem som påverkar patienten.'
    renderAndOpenDropdown(expected)

    expect(screen.getByText(expected)).toBeVisible()
  })

  it('display icd codes after ICF button is clicked', () => {
    const icfData = getIcfData()
    renderAndOpenDropdown()

    expect(screen.getAllByText(icfData.activityLimitation!.commonCodes.icdCodes[0].title)[1]).toBeInTheDocument()
    expect(screen.getAllByText(icfData.activityLimitation!.commonCodes.icdCodes[1].title)[1]).toBeInTheDocument()
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

    userEvent.click(screen.getAllByTestId(sut!.title)[0])

    expect(screen.getByText(expected!)).toBeInTheDocument()
  })

  it('hides description when expanding and de-expanding show more', () => {
    const icfData = getIcfData()
    const sut = icfData.activityLimitation?.commonCodes.icfCodes[0]
    const expected = sut?.description
    renderAndOpenDropdown()

    userEvent.click(screen.getAllByTestId(sut!.title)[0])
    userEvent.click(screen.getAllByTestId(sut!.title)[0])

    expect(screen.queryByText(expected!)).not.toBeInTheDocument()
  })

  it('display disabled add button before any icf code is selected', () => {
    renderAndOpenDropdown()

    expect(
      screen.getByRole('button', {
        name: /lägg till/i,
      })
    ).toBeDisabled()
  })

  it('display disabled cancel button before any icf code is selected', () => {
    renderAndOpenDropdown()

    expect(
      screen.getByRole('button', {
        name: /Avbryt/i,
      })
    ).toBeDisabled()
  })

  it('display link in footer to socialstyrelsen', () => {
    renderAndOpenDropdown()

    expect(screen.getByText('Läs mer om ICF hos Socialstyrelsenlaunch')).toBeInTheDocument()
    expect(screen.getByText('Läs mer om ICF hos Socialstyrelsenlaunch')).toHaveAttribute(
      'href',
      'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf'
    )
  })
})

const renderAndOpenDropdown = (title?: string, icfData?: Icf) => {
  renderComponent(title, icfData)
  setDefaultIcfState()
  openIcfDropdown()
}

const setDefaultIcfState = () => {
  const icfData = getIcfData()
  testStore.dispatch(updateIcfCodes(icfData))
  setDefaultFmb()
}

const openIcfDropdown = () => {
  userEvent.click(screen.getByText('Ta hjälp av ICF'))
}

const getIcfData = (): IcfState => {
  const icfCodes: IcfCode[] = [
    {
      code: '1',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '2',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '3',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: IcdCode[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes: icfCodes, icdCodes: icdCodes },
      uniqueCodes: [
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_1] },
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_2] },
      ],
    },
    disability: {
      commonCodes: { icfCodes: icfCodes, icdCodes: icdCodes },
      uniqueCodes: [
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_1] },
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_2] },
      ],
    },
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
