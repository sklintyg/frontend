import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppHeader from './AppHeader'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '@frontend/webcert/src/store/reducers'
import dispatchHelperMiddleware from '@frontend/webcert/src/store/test/dispatchHelperMiddleware'

let testStore: EnhancedStore

const renderComponent = (primaryItems: React.ReactNode[], secondaryItems: React.ReactNode[]) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create">
          <AppHeader primaryItems={primaryItems} secondaryItems={secondaryItems} />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

const renderComponentWithLogo = (logo: string, alt: string) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create">
          <AppHeader logo={logo} alt={alt} />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('App header', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware),
    })
  })

  it('displays primary items', (): void => {
    renderComponent([<p>Test</p>], [])
    expect(screen.getByText(/Test/i)).toBeInTheDocument()
  })

  it('displays secondary items', (): void => {
    renderComponent([], [<p>Test test</p>])
    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
  })

  it('displays several primary items', (): void => {
    renderComponent(
      [
        <div>
          <p>Test</p>
          <span>My text</span>
        </div>,
      ],
      []
    )
    expect(screen.getByText(/Test/i)).toBeInTheDocument()
    expect(screen.getByText(/My text/i)).toBeInTheDocument()
  })

  it('displays several secondary items', (): void => {
    renderComponent([], ['Testing', 'Test test'])
    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
    expect(screen.getByText(/Testing/i)).toBeInTheDocument()
  })

  it('displays primary and secondary items', (): void => {
    renderComponent(
      [
        <div>
          <p>Primary items</p>
          <span>My text</span>
        </div>,
      ],
      ['Testing', 'Test test']
    )

    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
    expect(screen.getByText(/Testing/i)).toBeInTheDocument()
    expect(screen.getByText(/Primary items/i)).toBeInTheDocument()
    expect(screen.getByText(/My text/i)).toBeInTheDocument()
  })

  it('displays logo', (): void => {
    renderComponentWithLogo('src', 'alt text')
    expect(screen.getByAltText(/alt text/i)).toBeInTheDocument()
  })
})
