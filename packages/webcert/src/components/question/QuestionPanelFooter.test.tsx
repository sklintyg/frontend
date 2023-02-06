import React from 'react'
import { render, screen } from '@testing-library/react'
import { getForwardResourceLink, getUnit, Question, QuestionType, ResourceLink, ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import QuestionPanelFooter from './QuestionPanelFooter'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import userEvent from '@testing-library/user-event'
import { answerComplementCertificate, complementCertificate, updateCertificate } from '../../store/certificate/certificateActions'
import { getTestCertificate } from '../../store/certificate/certificateMiddleware.test'
import { configureApplicationStore } from '../../store/configureApplicationStore'

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
    testStore = configureApplicationStore([dispatchHelperMiddleware, questionMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('not started complement', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      renderComponent([expectedQuestion])
    })

    it('display complement button if resource link is available', () => {
      expect(screen.getByText('Komplettera')).toBeInTheDocument()
    })

    it('complement certificate if button clicked', () => {
      userEvent.click(screen.getByText('Komplettera'))

      flushPromises()
      const complementCertificateAction = dispatchedActions.find((action) => complementCertificate.match(action))
      expect(complementCertificateAction).toBeTruthy()
    })

    it('display cannot complement button if resource link is available', () => {
      expect(screen.getByText('Kan inte komplettera')).toBeInTheDocument()
    })

    it('complement certificate with a new certificate and message', () => {
      userEvent.click(screen.getByText('Kan inte komplettera'))
      userEvent.click(screen.getByText('Ingen ytterligare medicinsk information kan anges.'))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)
      userEvent.click(screen.getByText('Skicka svar'))

      flushPromises()
      const complementCertificateAction = dispatchedActions.find((action) => complementCertificate.match(action))
      expect(complementCertificateAction?.payload.message).toEqual(newMessage)
    })

    it('answer complement with a message', () => {
      userEvent.click(screen.getByText('Kan inte komplettera'))
      userEvent.click(screen.getByText('Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget.'))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      userEvent.type(messageField, newMessage)
      userEvent.click(screen.getByText('Skicka svar'))

      flushPromises()
      const answerComplementCertificateAction = dispatchedActions.find((action) => answerComplementCertificate.match(action))
      expect(answerComplementCertificateAction?.payload).toEqual(newMessage)
    })

    it('display forward button if resource link is available', () => {
      const resourceLinks: ResourceLink[] = [getForwardResourceLink()]
      const unit = getUnit()
      const certificate = getTestCertificate('certificateId')
      certificate.links = resourceLinks
      certificate.metadata.unit = unit
      certificate.metadata.careProvider = unit

      testStore.dispatch(updateCertificate(certificate))

      expect(screen.getByText('Vidarebefordra')).toBeInTheDocument()
    })

    it('does not display forward button if resource link is not available', () => {
      expect(screen.queryByText('Vidarebefordra')).not.toBeInTheDocument()
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
    links: [
      {
        type: ResourceLinkType.COMPLEMENT_CERTIFICATE,
        enabled: true,
        description: 'beskrivning',
        name: 'Komplettera',
      },
      { type: ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE, enabled: true, description: 'beskrivning', name: 'Kan inte komplettera' },
    ],
  }
}
