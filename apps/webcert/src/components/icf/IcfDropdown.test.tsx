/* eslint-disable jest/no-disabled-tests */
import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { fakeIcfResponse } from '../../faker'
import { CertificateContext } from '../../feature/certificate/CertificateContext'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setOriginalIcd10Codes, updateIcfCodes } from '../../store/icf/icfActions'
import { icfMiddleware } from '../../store/icf/icfMiddleware'
import type { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { clearDispatchedActions, dispatchHelperMiddleware } from '../../store/test/dispatchHelperMiddleware'
import IcfDropdown from './IcfDropdown'

let testStore: EnhancedStore

const COLLECTIONS_LABEL = 'collectionsLabel'

const mockContext = { certificateContainerId: '', certificateContainerRef: createRef<HTMLDivElement>() }

Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() })

const getIcfValues = () => ['1', '2']

const renderComponent = (
  infoText = 'infoText test',
  icfData = fakeIcfResponse().activityLimitation,
  icfValues = getIcfValues(),
  disabled = false
) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <CertificateContext.Provider value={mockContext}>
          <IcfDropdown
            modalLabel={infoText}
            icfData={icfData}
            chosenIcfCodeValues={icfValues}
            collectionsLabel={COLLECTIONS_LABEL}
            disabled={disabled}
            onAddCode={() => null}
            onRemoveCode={() => null}
            id="test"
          />
        </CertificateContext.Provider>
      </MemoryRouter>
    </Provider>
  )
}

const updateOriginalIcd10Codes = () => {
  const codeInfo: string[] = ['A02', 'U071']

  testStore.dispatch(setOriginalIcd10Codes(codeInfo))
}
const setDefaultIcfState = () => {
  const icfData = fakeIcfResponse()
  testStore.dispatch(updateIcfCodes(icfData))
  updateOriginalIcd10Codes()
}

const toggleIcfDropdown = async () => {
  await userEvent.click(screen.getByText('Ta hjälp av ICF'))
}

const renderAndOpenDropdown = (title?: string, icfData?: AvailableIcfCodes, icfValues?: string[]) => {
  renderComponent(title, icfData, icfValues)
  setDefaultIcfState()
  toggleIcfDropdown()
}

// Scroll library is not working correctly with jsdom
describe.skip('IcfDropdown', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, icfMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('display disabled button if no icd codes', async () => {
    renderComponent()

    await expect(screen.getByText('Ta hjälp av ICF')).toBeDisabled()
  })

  it('display disabled button if disabled prop is true', async () => {
    renderComponent(undefined, undefined, undefined, true)
    setDefaultIcfState()

    await expect(screen.getByText('Ta hjälp av ICF')).toBeDisabled()
  })

  it.skip('display tooltip if no icd codes', async () => {
    renderComponent()
    const expected = 'Ange minst en diagnos för att få ICF-stöd.'

    await userEvent.hover(screen.getByText('Ta hjälp av ICF'))

    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('display enabled button if icd codes exist', async () => {
    renderComponent()
    setDefaultIcfState()

    await expect(screen.getByText('Ta hjälp av ICF')).toBeEnabled()
  })

  it('display no infoText before ICF button is clicked', () => {
    const expected = 'Välj enbart de problem som påverkar patienten.'
    renderComponent(expected)
    setDefaultIcfState()

    expect(screen.queryByText(expected)).not.toBeInTheDocument()
  })

  it('display infoText after ICF button is clicked', async () => {
    const expected = 'Välj enbart de problem som påverkar patienten.'
    renderAndOpenDropdown(expected)

    await expect(screen.getByText(expected)).toBeVisible()
  })

  it('display icd codes after ICF button is clicked', () => {
    const icfData = fakeIcfResponse()
    renderAndOpenDropdown()
    expect(screen.getAllByText(icfData.activityLimitation?.commonCodes.icd10Codes[0].title ?? '')[0]).toBeInTheDocument()
    expect(screen.getAllByText(icfData.activityLimitation?.commonCodes.icd10Codes[1].title ?? '')[0]).toBeInTheDocument()
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

  it('display description when expanding show more', async () => {
    const icfData = fakeIcfResponse()
    const sut = icfData.activityLimitation?.commonCodes.icfCodes[0]
    const expected = sut?.description
    renderAndOpenDropdown()

    await userEvent.click(screen.getAllByTestId(`${sut?.title}-showmore`)[0])

    expect(screen.getByText(`${expected}`)).toBeInTheDocument()
  })

  it('hides description when expanding and de-expanding show more', async () => {
    const icfData = fakeIcfResponse()
    const sut = icfData.activityLimitation?.commonCodes.icfCodes[0]
    const expected = sut?.description
    renderAndOpenDropdown()

    await userEvent.click(screen.getAllByTestId(`${sut?.title}-showmore`)[0])
    await userEvent.click(screen.getAllByTestId(`${sut?.title}-showmore`)[0])

    expect(screen.queryByText(`${expected}`)).not.toBeInTheDocument()
  })

  it('display link in footer to socialstyrelsen', async () => {
    renderAndOpenDropdown()

    expect(screen.getByText('Läs mer om ICF hos Socialstyrelsen')).toBeInTheDocument()
    await expect(screen.getByText('Läs mer om ICF hos Socialstyrelsen')).toHaveAttribute(
      'href',
      'https://www.socialstyrelsen.se/statistik-och-data/klassifikationer-och-koder/icf'
    )
  })

  it('shall display close button in modal', () => {
    renderAndOpenDropdown()

    expect(screen.getByRole('button', { name: /stäng/i })).toBeInTheDocument()
  })

  it('checkbox is checked if icf id is passed to component', async () => {
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)

    await expect(screen.getByRole('checkbox', { name: icfData.activityLimitation?.commonCodes.icfCodes[0].title })).toBeChecked()
  })

  it('shall display chosen values', () => {
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    updateOriginalIcd10Codes()
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    icfValues?.forEach(async (value) => {
      const valueTitle = screen.getByText(value)
      await expect(valueTitle).toBeVisible()
    })
  })

  it('shall display collections label', () => {
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    updateOriginalIcd10Codes()
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    expect(screen.getByText(COLLECTIONS_LABEL)).toBeInTheDocument()
  })

  it('shall display chosen values if no icd codes', () => {
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderComponent(undefined, icfData.activityLimitation, icfValues)

    icfValues?.forEach(async (value) => {
      const valueTitle = screen.getByText(value)
      await expect(valueTitle).toBeVisible()
    })
  })

  it('shall show info symbol that support is for another icd10 code', () => {
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)
    testStore.dispatch(setOriginalIcd10Codes(['A02'])) // remove one original code
    expect(screen.getByTestId('originalWarningIcf')).toBeInTheDocument()
  })

  it('shall not show info symbol that support exists for another icd10 code', () => {
    const icfData = fakeIcfResponse()
    updateOriginalIcd10Codes()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(undefined, icfData.activityLimitation, icfValues)
    expect(screen.queryByTestId('originalWarningIcf')).not.toBeInTheDocument()
  })

  it('should close dropdown on escape press', async () => {
    const expectedText = 'Test'
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(expectedText, icfData.activityLimitation, icfValues)
    await userEvent.keyboard('{escape}')
    expect(screen.queryByText(expectedText)).not.toBeInTheDocument()
  })

  it('should have correct tab order', async () => {
    const expectedText = 'Test'
    const icfData = fakeIcfResponse()
    const icfValues = icfData.activityLimitation?.commonCodes.icfCodes.map((code) => code.title)
    renderAndOpenDropdown(expectedText, icfData.activityLimitation, icfValues)
    testStore.dispatch(setOriginalIcd10Codes(['A02'])) // remove one code

    // eslint-disable-next-line testing-library/no-node-access
    const container = screen.getByText('ICF-kategorier gemensamma för:').closest('#icfDropdown-test') as Element

    await userEvent.tab({ focusTrap: container })
    // eslint-disable-next-line testing-library/no-node-access
    await expect(screen.getByText('Covid-19, virus identifierat').querySelector('img')).toHaveFocus()

    await userEvent.tab({ focusTrap: container })
    await expect(screen.getByLabelText('title 0')).toHaveFocus()

    await userEvent.tab({ focusTrap: container })
    await expect(screen.getByTestId('title 0-showmore')).toHaveFocus()
  })
})
