import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { fakeCertificate, fakeQuestion, fakeResourceLink } from '../../../faker'
import { answerComplementCertificate, complementCertificate, updateCertificate } from '../../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { questionMiddleware } from '../../../store/question/questionMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { Question, QuestionType, ResourceLinkType } from '../../../types'
import { flushPromises } from '../../../utils/flushPromises'
import { QuestionPanelFooter } from './QuestionPanelFooter'

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

function createQuestion(): Question {
  return fakeQuestion({
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
  })
}

describe('QuestionPanelFooter', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, questionMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  describe('not started complement', () => {
    const expectedQuestion = createQuestion()

    it('display complement button if resource link is available', () => {
      renderComponent([expectedQuestion])
      expect(screen.getByText('Komplettera')).toBeInTheDocument()
    })

    it('complement certificate if button clicked', async () => {
      renderComponent([expectedQuestion])
      await userEvent.click(screen.getByText('Komplettera'))

      flushPromises()
      const complementCertificateAction = dispatchedActions.find((action) => complementCertificate.match(action))
      expect(complementCertificateAction).toBeTruthy()
    })

    it('display cannot complement button if resource link is available', () => {
      renderComponent([expectedQuestion])
      expect(screen.getByText('Kan inte komplettera')).toBeInTheDocument()
    })

    it('complement certificate with a new certificate and message', async () => {
      renderComponent([expectedQuestion])
      await userEvent.click(screen.getByText('Kan inte komplettera'))
      await userEvent.click(screen.getByText('Ingen ytterligare medicinsk information kan anges.'))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, newMessage)
      await userEvent.click(screen.getByText('Skicka svar'))

      flushPromises()
      const complementCertificateAction = dispatchedActions.find((action) => complementCertificate.match(action))
      expect(complementCertificateAction?.payload.message).toEqual(newMessage)
    })

    it('answer complement with a message', async () => {
      renderComponent([expectedQuestion])
      await userEvent.click(screen.getByText('Kan inte komplettera'))
      await userEvent.click(screen.getByText('Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget.'))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, newMessage)
      await userEvent.click(screen.getByText('Skicka svar'))

      flushPromises()
      const answerComplementCertificateAction = dispatchedActions.find((action) => answerComplementCertificate.match(action))
      expect(answerComplementCertificateAction?.payload).toEqual(newMessage)
    })

    it('display forward button if resource link is available', () => {
      renderComponent([expectedQuestion])
      flushPromises()
      const resourceLinks = [fakeResourceLink({ type: ResourceLinkType.FORWARD_QUESTION })]
      testStore.dispatch(
        updateCertificate(
          fakeCertificate({
            metadata: { id: 'certificateId' },
            links: resourceLinks,
          })
        )
      )
      const question = createQuestion()
      question.links.push(resourceLinks[0])
      renderComponent([question])

      expect(screen.getByText('Vidarebefordra')).toBeInTheDocument()
    })

    it('does not display forward button if resource link is not available', () => {
      renderComponent([expectedQuestion])
      expect(screen.queryByText('Vidarebefordra')).not.toBeInTheDocument()
    })

    it('Should answer complement when resource link is CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE', async () => {
      const link = fakeResourceLink({ type: ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE })
      const question = fakeQuestion({ links: [link] })
      renderComponent([question])
      await userEvent.click(screen.getByText('Kan ej komplettera'))
      await userEvent.click(screen.getByText('Ingen ytterligare medicinsk information kan anges.'))
      const newMessage = 'Det här är ett meddelande'
      const messageField = screen.getByRole('textbox')
      await userEvent.type(messageField, newMessage)
      await userEvent.click(screen.getByText('Skicka svar'))

      flushPromises()
      const answerComplementCertificateAction = dispatchedActions.find((action) => answerComplementCertificate.match(action))
      expect(answerComplementCertificateAction?.payload).toEqual(newMessage)
    })
  })
})
