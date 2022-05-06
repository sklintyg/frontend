import { render, screen } from '@testing-library/react'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import React from 'react'
import reducer from '../../store/reducers'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import { CertificateRelation, CertificateRelationType, CertificateStatus, Question, QuestionType, ResourceLinkType } from '@frontend/common'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import { COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE } from './QuestionItem'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderComponent = (questions: Question[], isDisplayingCertificateDraft: boolean) => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <ComplementQuestionPanel
          complementQuestions={questions}
          isDisplayingCertificateDraft={isDisplayingCertificateDraft}
          headerHeight={0}
        />
      </Router>
    </Provider>
  )
}

describe('ComplementQuestionPanel', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(questionMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderComponent([], false)
  })

  it('displays text when there are no questions', () => {
    renderComponent([], false)
    expect(screen.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    beforeEach(() => {
      renderComponent([expectedQuestion], false)
    })

    it('displays author', () => {
      expect(screen.getByText(expectedQuestion.author)).toBeInTheDocument()
    })

    it('displays message', () => {
      expect(screen.getByText(expectedQuestion.message)).toBeInTheDocument()
    })

    it('displays sent', () => {
      expect(screen.getByText(expectedQuestion.sent, { exact: false })).toBeInTheDocument()
    })

    it('displays subject', () => {
      expect(screen.getByText(expectedQuestion.subject)).toBeInTheDocument()
    })

    it('displays complement question text', () => {
      expect(screen.getByText(expectedQuestion.complements[0].questionText)).toBeInTheDocument()
    })
  })

  describe('ongoing complement', () => {
    const expectedQuestion = addAnswerByCertificate(createQuestion(), {
      type: CertificateRelationType.COMPLEMENTED,
      certificateId: 'certificateId',
      created: new Date().toISOString(),
      status: CertificateStatus.UNSIGNED,
    })

    it('displays information about existing draft', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText('Det finns redan en påbörjad komplettering.')).toBeInTheDocument()
    })

    it('displays link to open existing draft', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText('Öppna utkastet')).toBeInTheDocument()
      expect(screen.getByText('Öppna utkastet')).toHaveAttribute('href', '/certificate/certificateId')
    })

    it('dont display information about existing draft if the draft is being displayed', () => {
      renderComponent([expectedQuestion], true)
      expect(screen.queryByText('Det finns redan en påbörjad komplettering.')).not.toBeInTheDocument()
    })
  })

  describe('completed complement', () => {
    const expectedQuestion = addAnswerByCertificate(createQuestion(), {
      type: CertificateRelationType.COMPLEMENTED,
      certificateId: 'certificateId',
      created: new Date().toISOString(),
      status: CertificateStatus.SIGNED,
    })

    beforeEach(() => {
      renderComponent([expectedQuestion], false)
    })

    it('displays information about complement certificate', () => {
      expect(screen.getByText('Kompletteringsbegäran besvarades med ett nytt intyg.')).toBeInTheDocument()
    })

    it('displays link to open complement certificate', () => {
      expect(screen.getByText('Öppna intyget')).toBeInTheDocument()
      expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/certificateId')
    })
  })

  describe('answered complement', () => {
    const expectedQuestion = addAnswerByMessage(createQuestion())

    beforeEach(() => {
      renderComponent([expectedQuestion], false)
    })

    it('displays information', () => {
      expect(screen.getByText(COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE)).toBeInTheDocument()
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
    type: QuestionType.COMPLEMENT,
    links: [{ type: ResourceLinkType.COMPLEMENT_CERTIFICATE, enabled: true, description: 'beskrivning', name: 'Komplettera' }],
  }
}

function addAnswerByCertificate(question: Question, answerByCertifiate: CertificateRelation): Question {
  return {
    ...question,
    answeredByCertificate: { ...answerByCertifiate },
  }
}

function addAnswerByMessage(question: Question): Question {
  return {
    ...question,
    answer: { author: 'Nisse', message: 'Det här är ett svar på en kompletteringsbegäran', id: 'svarsId', sent: new Date().toISOString() },
  }
}
