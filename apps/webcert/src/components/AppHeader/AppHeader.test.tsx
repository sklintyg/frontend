import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { userMiddleware } from '../../store/user/userMiddleware'
import SystemBanner from '../utils/SystemBanner'
import AppHeader from './AppHeader'

let testStore: EnhancedStore

const renderComponent = (primaryUserMenu: React.ReactNode[], secondaryItems: React.ReactNode[]) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route path="/create" element={<AppHeader primaryUserMenu={primaryUserMenu} secondaryUserMenu={secondaryItems} />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

const renderComponentWithLogo = (logo: string, alt: string) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route path="/create" element={<AppHeader logo={logo} alt={alt} />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

const renderComponentWithSubMenuBanners = (subMenuBanners: React.ReactNode[]) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route path="/create" element={<AppHeader subMenuBanners={subMenuBanners} />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('App header', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([userMiddleware])
  })

  it('displays primary items', (): void => {
    renderComponent([<p key="id">Test</p>], [])
    expect(screen.getByText(/Test/i)).toBeInTheDocument()
  })

  it('displays secondary items', (): void => {
    renderComponent([], [<p key="id">Test test</p>])
    expect(screen.getByText(/Test test/i)).toBeInTheDocument()
  })

  it('displays several primary items', (): void => {
    renderComponent(
      [
        <div key="id">
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
        <div key="id">
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
        key="id"
        banner={{
          message: BANNER_TEXT,
          priority: 'MEDEL',
        }}
      />,
    ])
    expect(screen.getByText(BANNER_TEXT)).toBeInTheDocument()
  })
})
