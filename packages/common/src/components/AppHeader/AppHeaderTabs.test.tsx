import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AppHeaderTabs from './AppHeaderTabs'
import { MemoryRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@frontend/webcert/src/store/store'
import { UserTab } from '../../types/utils'

const getTabs = (): UserTab[] => {
  return [
    {
      title: 'Tab1',
      url: '/url/tab1',
      number: 10,
    },
  ]
}

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/create']}>
        <Route path="/create">
          <AppHeaderTabs tabs={getTabs()} />{' '}
        </Route>
      </MemoryRouter>
    </Provider>
  )
}

describe('AppHeaderTabs', () => {
  it('should show tab title', () => {
    renderComponent()
    expect(screen.getByText('Tab1')).toBeInTheDocument()
  })

  it('should show tab number', () => {
    renderComponent()
    expect(screen.getByText(10)).toBeInTheDocument()
  })
})
