import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppHeaderTabs from './AppHeaderTabs'
import { MemoryRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { UserTab } from '../../types/utils'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '@frontend/webcert/src/store/reducers'
import { userMiddleware } from '@frontend/webcert/src/store/user/userMiddleware'

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

const renderComponent = (url: string, matchedUrl: string) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[PAGE_URL]}>
        <Route path={PAGE_URL}>
          <AppHeaderTabs tabs={getTabs(url, matchedUrl)} />{' '}
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('AppHeaderTabs', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(userMiddleware),
    })
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
})
