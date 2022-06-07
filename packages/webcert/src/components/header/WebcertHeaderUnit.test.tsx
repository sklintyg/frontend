import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { getUser, getUserStatistics, getUserWithInactiveUnit, ResourceLinkType } from '@frontend/common'
import WebcertHeaderUnit from './WebcertHeaderUnit'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import apiMiddleware from '../../store/api/apiMiddleware'
import { userMiddleware } from '../../store/user/userMiddleware'
import reducer from '@frontend/webcert/src/store/reducers'
import { updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import userEvent from '@testing-library/user-event'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <WebcertHeaderUnit />
    </Provider>
  )
}

describe('Webcert header unit', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('displays care provider and unit that user is logged into', (): void => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()

    expect(screen.getByText(/Care unit/i)).toBeInTheDocument()
  })

  it('should open the dropdpwn with the button for changing unit when clicking on expand button', () => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()

    testStore.dispatch(
      updateUserResourceLinks([
        {
          type: ResourceLinkType.CHANGE_UNIT,
          name: 'Byta vårdenhet',
          body: '',
          description: '',
          enabled: true,
        },
      ])
    )

    userEvent.click(screen.getAllByTestId('expandChangeUnit')[0])
    expect(screen.getByText(/Byt vårdenhet/i)).toBeInTheDocument()
  })

  describe('Inactive unit', () => {
    it('should not display inactive message for active unit', (): void => {
      testStore.dispatch(updateUser(getUser()))
      renderComponent()

      expect(screen.queryByText(/Inaktiv enhet/i)).not.toBeInTheDocument()
    })

    it('should display inactive message for inactive unit', (): void => {
      testStore.dispatch(updateUser(getUserWithInactiveUnit()))
      renderComponent()

      expect(screen.getByText(/Inaktiv enhet/i, { exact: false })).toBeInTheDocument()
    })
  })

  describe('Statistics', () => {
    it('should show statistics on other units if resource link exists', () => {
      testStore.dispatch(updateUser(getUser()))
      testStore.dispatch(updateUserStatistics(getUserStatistics()))

      renderComponent()

      testStore.dispatch(
        updateUserResourceLinks([
          {
            type: ResourceLinkType.CHANGE_UNIT,
            name: 'Byta vårdenhet',
            body: '',
            description: '',
            enabled: true,
          },
        ])
      )

      expect(screen.getByText('17 ej hanterade ärenden och ej signerade utkast på andra vårdenheter.')).toBeInTheDocument()
    })
  })
})
