import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppHeader from './AppHeader'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { EnhancedStore } from '@reduxjs/toolkit'
import SystemBanner from '@frontend/common/src/components/utils/SystemBanner'
import { userMiddleware } from '../../store/user/userMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'

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

const renderComponentWithSubMenuBanners = (subMenuBanners: React.ReactNode[]) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create">
          <AppHeader subMenuBanners={subMenuBanners} />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('App header', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([userMiddleware])
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

  it('displays submenu banners', (): void => {
    const BANNER_TEXT =
      'Abonnemang för Webcert saknas. Du har endast tillgång till Webcert för att läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.'

    renderComponentWithSubMenuBanners([
      <SystemBanner
        banner={{
          message: BANNER_TEXT,
          priority: 'MEDEL',
        }}
      />,
    ])
    expect(screen.getByText(BANNER_TEXT)).toBeInTheDocument()
  })
})
