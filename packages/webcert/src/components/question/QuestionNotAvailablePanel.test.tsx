import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionNotAvailablePanel from './QuestionNotAvailablePanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionNotAvailablePanel tabIndex={0} selectedTabIndex={0} minimizeSidePanel={<></>} />
      </Router>
    </Provider>
  )
}

describe('QuestionNotAvailablePanel', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(...questionMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('display header', () => {
    renderDefaultComponent()

    expect(screen.getByText('Kompletteringsbegäran och administrativa frågor')).toBeInTheDocument()
  })

  it('display not available text', () => {
    renderDefaultComponent()

    expect(screen.getByText('Intyget är inte skickat till Försäkringskassan.')).toBeInTheDocument()
    expect(screen.getByText('Det går därför inte att ställa frågor på intyget.')).toBeInTheDocument()
  })
})
