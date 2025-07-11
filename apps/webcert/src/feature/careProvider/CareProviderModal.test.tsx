import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { START_URL } from '../../constants'
import {
  fakeCareProvider,
  fakeCareUnit,
  fakePatient,
  fakeResourceLink,
  fakeUnit,
  fakeUnitStatistic,
  fakeUser,
  fakeUserStatistics,
} from '../../faker'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setPatient } from '../../store/patient/patientActions'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { updateIsCareProviderModalOpen, updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import { ResourceLinkType } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import CareProviderModal from './CareProviderModal'

let fakeAxios: MockAdapter
let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<CareProviderModal />} />
          <Route path={START_URL} element="you are on the search page" />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('Care provider modal', () => {
  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  afterEach(() => clearDispatchedActions())

  it('should NOT show modal if resource link for choose unit does not exist', () => {
    testStore.dispatch(updateUser(fakeUser()))

    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should NOT show total amount of unhandled questions if user has no units under the care unit', () => {
    testStore.dispatch(updateUser(fakeUser({ loggedInUnit: {}, loggedInCareUnit: {}, loggedInCareProvider: {} })))
    testStore.dispatch(updateUserStatistics(fakeUserStatistics({ unitStatistics: { '1234a': fakeUnitStatistic() } })))

    renderComponent()
    const text = screen.queryByText('total', { exact: false })
    expect(text).not.toBeInTheDocument()
  })

  describe('Tests with user and open care provider modal', () => {
    beforeEach(() => {
      testStore.dispatch(
        updateUser(
          fakeUser({
            careProviders: [
              fakeCareProvider({
                careUnits: [
                  fakeCareUnit({
                    unitId: '1234c',
                    unitName: 'Care unit 2',
                  }),
                ],
              }),
            ],
          })
        )
      )
      testStore.dispatch(
        updateUserStatistics(
          fakeUserStatistics({
            unitStatistics: Object.fromEntries(['1234a', '1234b', '1234c'].map((id) => [id, fakeUnitStatistic()])),
          })
        )
      )
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]))
      testStore.dispatch(updateIsCareProviderModalOpen(true))
    })

    it('should show button to close modal if resource link for change unit exists', () => {
      renderComponent()
      expect(screen.getByText('Avbryt')).toBeInTheDocument()
    })

    it('should set navigate to start page when choosing unit', async () => {
      renderComponent()

      await userEvent.click(screen.getByText('Care unit 2'))
      expect(screen.getByText(/you are on the search page/i)).toBeInTheDocument()
    })

    it('should close modal when clicking outside the modal', async () => {
      renderComponent()
      await userEvent.click(screen.getByTestId('modal-backdrop'))
      expect(screen.queryByText('Byt vårdenhet')).not.toBeInTheDocument()
    })
  })

  describe('Tests with no logged in unit', () => {
    beforeEach(() => {
      testStore.dispatch(
        updateUser(
          fakeUser({
            loggedInUnit: {},
            loggedInCareUnit: {},
            loggedInCareProvider: {},
            careProviders: [
              fakeCareProvider({
                careUnits: [
                  fakeCareUnit({
                    unitId: '1234a',
                    unitName: 'Care unit',
                    units: [fakeUnit({ unitId: '1234b' })],
                  }),
                ],
              }),
            ],
          })
        )
      )
      testStore.dispatch(
        updateUserStatistics(
          fakeUserStatistics({
            unitStatistics: Object.fromEntries(['1234a', '1234b', '1234c'].map((id) => [id, fakeUnitStatistic()])),
          })
        )
      )
    })

    it('should show care provider modal if choose unit resource link exists', () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))

      renderComponent()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should NOT show care provider modal if resource link does not exist', () => {
      renderComponent()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should clear patient and close modal when unit is chosen', async () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))
      testStore.dispatch(setPatient(fakePatient()))
      fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: fakeUser() })

      renderComponent()

      expect(testStore.getState().ui.uiPatient.patient).not.toBeUndefined()

      await userEvent.click(screen.getByText('Care unit'))

      await flushPromises()

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(testStore.getState().ui.uiPatient.patient).toBeUndefined()
    })

    it('should show care units when care provider modal is open', () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))

      renderComponent()
      expect(screen.getByText('Care unit')).toBeInTheDocument()
    })

    it('should show total amount of unhandled questions if user has units under the care unit', async () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))
      renderComponent()
      expect(await screen.findByText('3 (totalt 4)')).toBeInTheDocument()
    })

    it('should show title for choosing unit', () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))

      renderComponent()
      expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
    })

    it('should not close the modal if choose unit resource link exists', async () => {
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))

      renderComponent()
      await userEvent.click(screen.getByTestId('modal-backdrop'))
      expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
    })
  })

  it('Should not crash on missing statistics', () => {
    testStore.dispatch(updateUser(fakeUser({ careProviders: [fakeCareProvider({ careUnits: [fakeCareUnit()] })] })))
    testStore.dispatch(updateUserStatistics(fakeUserStatistics()))
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHOOSE_UNIT })]))

    expect(() => renderComponent()).not.toThrow()
  })
})
