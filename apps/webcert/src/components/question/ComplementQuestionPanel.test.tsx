import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { updateIsLoadingQuestions } from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import type { CertificateRelation, Question } from '../../types'
import { CertificateRelationType, CertificateStatus, QuestionType, ResourceLinkType } from '../../types'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import { COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE } from './QuestionItem'

let testStore: EnhancedStore

const renderComponent = (questions: Question[], isDisplayingCertificateDraft: boolean) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <ComplementQuestionPanel complementQuestions={questions} isDisplayingCertificateDraft={isDisplayingCertificateDraft} />
      </MemoryRouter>
    </Provider>
  )
}

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
    certificateId: 'certificateId',
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

describe('ComplementQuestionPanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([questionMiddleware])

    testStore.dispatch(updateIsLoadingQuestions(false))
  })

  it('renders without crashing', () => {
    expect(() => renderComponent([], false)).not.toThrow()
  })

  it('displays text when there are no questions', () => {
    renderComponent([], false)
    expect(screen.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeInTheDocument()
  })

  describe('renders a question', () => {
    const expectedQuestion = createQuestion()

    it('displays author', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText(expectedQuestion.author)).toBeInTheDocument()
    })

    it('displays message', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText(expectedQuestion.message)).toBeInTheDocument()
    })

    it('displays sent', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText(expectedQuestion.sent, { exact: false })).toBeInTheDocument()
    })

    it('displays subject', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText(expectedQuestion.subject)).toBeInTheDocument()
    })

    it('displays complement question text', () => {
      renderComponent([expectedQuestion], false)
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

    it('displays link to open existing draft', async () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText('Öppna utkastet')).toBeInTheDocument()
      await expect(screen.getByText('Öppna utkastet')).toHaveAttribute('href', '/certificate/certificateId')
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

    it('displays information about complement certificate', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText('Kompletteringsbegäran besvarades med ett nytt intyg.')).toBeInTheDocument()
    })

    it('displays link to open complement certificate', async () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText('Öppna intyget')).toBeInTheDocument()
      await expect(screen.getByText('Öppna intyget')).toHaveAttribute('href', '/certificate/certificateId')
    })
  })

  describe('answered complement', () => {
    const expectedQuestion = addAnswerByMessage(createQuestion())

    it('displays information', () => {
      renderComponent([expectedQuestion], false)
      expect(screen.getByText(COMPLEMENTARY_QUESTIONS_HAS_BEEN_ANSWERED_MESSAGE)).toBeInTheDocument()
    })
  })
})
