import {
  fakePatient,
  getChangeUnitResourceLink,
  getChooseUnitResourceLink,
  getUser,
  getUserStatistics,
  getUserStatisticsForOneCareUnit,
  getUserWithEmptyCareUnitWithoutUnits,
  getUserWithEmptyUnit,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import { START_URL_FOR_DOCTORS } from '../../constants'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setPatient } from '../../store/patient/patientActions'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { updateIsCareProviderModalOpen, updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import CareProviderModal from './CareProviderModal'

let fakeAxios: MockAdapter
let testStore: EnhancedStore
const history = createMemoryHistory()
history.push = vi.fn()

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <CareProviderModal />
      </Router>
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
    testStore.dispatch(updateUser(getUser()))

    renderComponent()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should NOT show total amount of unhandled questions if user has no units under the care unit', () => {
    testStore.dispatch(updateUser(getUserWithEmptyCareUnitWithoutUnits()))
    testStore.dispatch(updateUserStatistics(getUserStatisticsForOneCareUnit()))

    renderComponent()
    const text = screen.queryByText('total', { exact: false })
    expect(text).not.toBeInTheDocument()
  })

  describe('Tests with user and open care provider modal', () => {
    beforeEach(() => {
      testStore.dispatch(updateUser(getUser()))
      testStore.dispatch(updateUserStatistics(getUserStatistics()))
      testStore.dispatch(updateUserResourceLinks(getChangeUnitResourceLink()))
      testStore.dispatch(updateIsCareProviderModalOpen(true))
    })

    it('should show button to close modal if resource link for change unit exists', () => {
      renderComponent()
      expect(screen.getByText('Avbryt')).toBeInTheDocument()
    })

    it('should set navigate to start page when choosing unit', async () => {
      renderComponent()

      await userEvent.click(screen.getByText('Care unit 2'))
      expect(history.push).toHaveBeenCalledWith(START_URL_FOR_DOCTORS)
    })

    it('should close modal when clicking outside the modal', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
      expect(screen.queryByText('Byt vårdenhet')).not.toBeInTheDocument()
    })
  })

  describe('Tests with no logged in unit', () => {
    beforeEach(() => {
      testStore.dispatch(updateUser(getUserWithEmptyUnit()))
      testStore.dispatch(updateUserStatistics(getUserStatistics()))
    })

    it('should show care provider modal if choose unit resource link exists', () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      renderComponent()
      expect(screen.queryByRole('dialog')).toBeInTheDocument()
    })

    it('should NOT show care provider modal if resource link does not exist', () => {
      renderComponent()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should clear patient and close modal when unit is chosen', async () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))
      testStore.dispatch(setPatient(fakePatient()))
      fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: getUser() })

      renderComponent()

      expect(testStore.getState().ui.uiPatient.patient).not.toBeUndefined()

      await userEvent.click(screen.getByText('Care unit'))

      await flushPromises()

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(testStore.getState().ui.uiPatient.patient).toBeUndefined()
    })

    it('should show care units when care provider modal is open', () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      renderComponent()
      expect(screen.getByText('Care unit')).toBeInTheDocument()
    })

    it('should show total amount of unhandled questions if user has units under the care unit', () => {
      renderComponent()
      const text = screen.queryAllByText('total', { exact: false })
      expect(text).toBeTruthy()
    })

    it('should show title for choosing unit', () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      renderComponent()
      expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
    })

    it('should not close the modal if choose unit resource link exists', async () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      renderComponent()
      await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
      expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
    })
  })
})
