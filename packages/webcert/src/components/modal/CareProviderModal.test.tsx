import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import CareProviderModal from './CareProviderModal'

describe('Care provider modal', () => {
  const renderComponent = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CareProviderModal title="Modaltext" open={false} />
        </BrowserRouter>
      </Provider>
    )
  }

  it('Shall show care provider modal if loggedInCareProvider is not set', () => {
    renderComponent()
  })
})
