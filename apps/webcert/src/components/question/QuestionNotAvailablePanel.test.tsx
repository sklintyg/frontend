import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionNotAvailablePanel from './QuestionNotAvailablePanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionNotAvailablePanel />
      </Router>
    </Provider>
  )
}

describe('QuestionNotAvailablePanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([questionMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
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
