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
import userEvent from '@testing-library/user-event'

let testStore: EnhancedStore

const PAGE_URL = '/url'
const TAB_TITLE = 'Tab1'
const TAB_TITLE_2 = 'Tab2'

const getOneTab = (url: string, matchedUrl: string): UserTab[] => {
  return [
    {
      title: TAB_TITLE,
      url: url,
      number: 10,
      matchedUrls: [matchedUrl],
    },
  ]
}

const getTabs = (url: string, matchedUrl: string): UserTab[] => {
  return [
    {
      title: TAB_TITLE,
      url: url,
      number: 10,
      matchedUrls: [matchedUrl],
    },
    {
      title: TAB_TITLE_2,
      url: url,
      matchedUrls: [matchedUrl],
    },
  ]
}

const onSwitchTab = jest.fn()

const renderComponent = (tabs: UserTab[], activeTab?: number) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[PAGE_URL]}>
        <Route path={PAGE_URL}>
          <AppHeaderTabs onSwitchTab={onSwitchTab} tabs={tabs} activeTab={activeTab} />
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
    renderComponent(getOneTab('', ''))
    expect(screen.getByText(TAB_TITLE)).toBeInTheDocument()
  })

  it('should show tab number', () => {
    renderComponent(getOneTab('', ''))
    expect(screen.getByText(10)).toBeInTheDocument()
  })

  it('should set tab as selected if url is matched', () => {
    renderComponent(getOneTab(PAGE_URL, ''))
    expect(screen.getByRole('listitem').firstChild).toHaveClass('selected')
  })

  it('should set tab as selected if matched url is matched', () => {
    renderComponent(getOneTab('', PAGE_URL))
    expect(screen.getByRole('listitem').firstChild).toHaveClass('selected')
  })

  it('should not set tab as selected if url is not matched', () => {
    renderComponent(getOneTab('notMatched', 'notMatched'))
    expect(screen.getByRole('listitem').firstChild).not.toHaveClass('selected')
  })

  it('should call onSwitchTab when switching tab', () => {
    renderComponent(getOneTab('', ''))
    userEvent.click(screen.getByText(TAB_TITLE))
    expect(onSwitchTab).toHaveBeenCalled()
  })

  it('should set active tab', () => {
    renderComponent(getTabs(PAGE_URL, PAGE_URL), 1)
    expect(screen.getByText(TAB_TITLE_2).parentElement).toHaveClass('selected')
  })
})
