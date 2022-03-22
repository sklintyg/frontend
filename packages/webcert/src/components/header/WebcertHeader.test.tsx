import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../store/store'
import WebcertHeader from './WebcertHeader'
import { updateUserResourceLinks } from '../../store/user/userActions'
import { ResourceLinkType } from '@frontend/common'
import { BrowserRouter } from 'react-router-dom'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <WebcertHeader />
      </BrowserRouter>
    </Provider>
  )
}

describe('WebcertHeader', () => {
  it('should render component', () => {
    renderComponent()
  })

  it('should display about Webcert', () => {
    renderComponent()
    expect(screen.getByText('Om Webcert')).toBeInTheDocument()
  })

  it('should display logout link if resource link exists', () => {
    renderComponent()
    store.dispatch(
      updateUserResourceLinks([
        {
          type: ResourceLinkType.LOG_OUT,
          name: 'Logga ut',
          body: '',
          description: '',
          enabled: true,
        },
      ])
    )

    expect(screen.getByText('Logga ut')).toBeInTheDocument()
  })
})
