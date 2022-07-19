import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import React from 'react'
import NavigateBackButton from './NavigateBackButton'
import reducer from '../../../store/reducers'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { userMiddleware } from '../../../store/user/userMiddleware'
import { updateUser, updateUserResourceLinks } from '../../../store/user/userActions'
import { getNavigateBackButtonLink, getUser } from '@frontend/common'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <NavigateBackButton />
    </Provider>
  )
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    length: 1,
  }),
}))

describe('NavigateBackButton', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, apiMiddleware, userMiddleware),
    })
  })

  it('should show navigate back button if link is available', () => {
    testStore.dispatch(updateUser(getUser()))
    testStore.dispatch(updateUserResourceLinks(getNavigateBackButtonLink()))
    renderComponent()
    expect(screen.getByText('Tillbaka')).toBeInTheDocument()
  })

  it('should not show navigate back button if link is not available', () => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()
    expect(screen.queryByText('Tillbaka')).not.toBeInTheDocument()
  })
})
