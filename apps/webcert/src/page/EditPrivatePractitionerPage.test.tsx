import type { EnhancedStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'vitest'
import { fakeUser } from '../faker'
import { configureApplicationStore } from '../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../store/test/dispatchHelperMiddleware'
import { updateUser } from '../store/user/userActions'
import { EditPrivatePractitionerPage } from './EditPrivatePractitionerPage'

let testStore: EnhancedStore

const renderComponent = () =>
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <EditPrivatePractitionerPage />
      </MemoryRouter>
    </Provider>
  )

describe('EditPrivatePractitionerPage', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
    testStore.dispatch(updateUser(fakeUser()))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should render the page without errors', () => {
    expect(() => renderComponent()).not.toThrow()
  })
})
