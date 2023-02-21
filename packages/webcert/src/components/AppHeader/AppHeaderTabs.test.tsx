import { UserTab } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { userMiddleware } from '../../store/user/userMiddleware'
import AppHeaderTabs from './AppHeaderTabs'

let testStore: EnhancedStore

const PAGE_URL = '/url'
const TAB_TITLE = 'Tab1'

const getTabs = (url: string, matchedUrl: string): UserTab[] => {
  return [
    {
      title: TAB_TITLE,
      url: url,
      number: 10,
      matchedUrls: [matchedUrl],
    },
  ]
}

const onSwitchTab = vi.fn()

const renderComponent = (url: string, matchedUrl: string) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[PAGE_URL]}>
        <Route path={PAGE_URL}>
          <AppHeaderTabs onSwitchTab={onSwitchTab} tabs={getTabs(url, matchedUrl)} />
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('AppHeaderTabs', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([userMiddleware])
  })

  it('should show tab title', () => {
    renderComponent('', '')
    expect(screen.getByText(TAB_TITLE)).toBeInTheDocument()
  })

  it('should show tab number', () => {
    renderComponent('', '')
    expect(screen.getByText(10)).toBeInTheDocument()
  })

  it('should set tab as selected if url is matched', () => {
    renderComponent(PAGE_URL, '')
    expect(screen.getByRole('listitem').firstChild).toHaveClass('selected')
  })

  it('should set tab as selected if matched url is matched', () => {
    renderComponent('', PAGE_URL)
    expect(screen.getByRole('listitem').firstChild).toHaveClass('selected')
  })

  it('should not set tab as selected if url is not matched', () => {
    renderComponent('notMatched', 'notMatched')
    expect(screen.getByRole('listitem').firstChild).not.toHaveClass('selected')
  })

  it('should call onSwitchTab when switching tab', () => {
    renderComponent('', '')
    userEvent.click(screen.getByText(TAB_TITLE))
    expect(onSwitchTab).toHaveBeenCalled()
  })
})
