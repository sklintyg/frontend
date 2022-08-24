import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { updateIsCareProviderModalOpen, updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import {
  getUserWithEmptyUnit,
  getUserStatistics,
  getUser,
  getUserWithEmptyCareUnitWithoutUnits,
  getUserStatisticsForOneCareUnit,
  getChooseUnitResourceLink,
  getChangeUnitResourceLink,
} from '@frontend/common'
import CareProviderModal from './CareProviderModal'
import userEvent from '@testing-library/user-event'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { createMemoryHistory } from 'history'
import { START_URL_FOR_DOCTORS } from '../../constants'

let fakeAxios: MockAdapter
let testStore: EnhancedStore
const history = createMemoryHistory()
history.push = jest.fn()

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
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
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

    it('should set navigate to start page when choosing unit', () => {
      renderComponent()

      userEvent.click(screen.getByText('Care unit'))
      expect(history.push).toHaveBeenCalledWith(START_URL_FOR_DOCTORS)
    })

    it('should close modal when clicking outside the modal', () => {
      renderComponent()
      userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
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

    it('should close modal when unit is chosen', async () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      fakeAxios.onPost('/api/user/unit/1234a').reply(200, { user: getUser() })

      renderComponent()

      userEvent.click(screen.getByText('Care unit'))

      await flushPromises()

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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

    it('should not close the modal if choose unit resource link exists', () => {
      testStore.dispatch(updateUserResourceLinks(getChooseUnitResourceLink()))

      renderComponent()
      userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
      expect(screen.getByText('Välj vårdenhet')).toBeInTheDocument()
    })
  })
})
