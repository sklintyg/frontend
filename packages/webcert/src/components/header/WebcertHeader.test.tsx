import { getUserWithMissingSubscription, ResourceLinkType } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import { updateUser, updateUserResourceLinks } from '../../store/user/userActions'
import WebcertHeader from './WebcertHeader'

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
    expect(() => renderComponent()).not.toThrow()
  })

  it('should display about Webcert', () => {
    renderComponent()
    expect(screen.getByText('Om Webcert')).toBeInTheDocument()
  })

  it('should display logout link if resource link exists', () => {
    renderComponent()
    act(() => {
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
    })

    expect(screen.getByText('Logga ut')).toBeInTheDocument()
  })

  it('should display subscription warning banner when care provider has no subscription', () => {
    store.dispatch(updateUser(getUserWithMissingSubscription()))
    renderComponent()

    expect(
      screen.getByText(
        'Abonnemang för Webcert saknas. Du har endast tillgång till Webcert för att läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.'
      )
    ).toBeInTheDocument()
  })
})
