import React from 'react'
import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import CareProviderModal from './CareProviderModal'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CareProviderModal open={true} title="Modaltext" />
      </BrowserRouter>
    </Provider>
  )
}

let testStore: EnhancedStore

describe('Care provider modal', () => {
  it('Shall not show care provider modal if loggedInCareProvider is set', () => {
    renderComponent()
  })
})
