import React from 'react'
import { render, screen } from '@testing-library/react'
import { Question, QuestionType, ResourceLinkType } from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import QuestionPanelFooter from './QuestionPanelFooter'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import userEvent from '@testing-library/user-event'
import { complementCertificate } from '../../store/certificate/certificateActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderComponent = (questions: Question[]) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionPanelFooter questions={questions} />
      </Router>
    </Provider>
  )
}

describe('', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, ...questionMiddleware),
    })
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('not started complement', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      renderComponent([expectedQuestion])
    })

    it('display complement button if resource linke is available', () => {
      expect(screen.getByText('Komplettera')).toBeInTheDocument()
    })

    it('complement certificate if button clicked', () => {
      userEvent.click(screen.getByText('Komplettera'))

      flushPromises()
      const complementCertificateAction = dispatchedActions.find((action) => complementCertificate.match(action))
      expect(complementCertificateAction).toBeTruthy()
    })
  })
})

function createQuestion(): Question {
  return {
    author: 'author',
    id: String(Math.random()),
    forwarded: true,
    handled: true,
    lastUpdate: '2021-07-08',
    message: 'message',
    sent: '2021-07-08',
    complements: [{ questionId: 'questionId', valueId: 'valueId', questionText: 'questionText', message: 'complementMessage' }],
    subject: 'subject',
    reminders: [],
    type: QuestionType.COORDINATION,
    links: [{ type: ResourceLinkType.COMPLEMENT_CERTIFICATE, enabled: true, description: 'beskrivning', name: 'Komplettera' }],
  }
}
