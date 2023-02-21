import { Certificate, CertificateMetadata, CertificateStatus, Question, QuestionType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import { setErrorId, updateIsLoadingQuestions, updateQuestions } from '../../store/question/questionActions'
import { questionMiddleware } from '../../store/question/questionMiddleware'
import QuestionPanel from './QuestionPanel'

let testStore: EnhancedStore

const history = createMemoryHistory()

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <Router history={history}>
        <QuestionPanel />
      </Router>
    </Provider>
  )
}

describe('QuestionPanel', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([questionMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('displays header for complement questions', () => {
    renderDefaultComponent()
    expect(screen.queryByText('Kompletteringsbegäran')).toBeInTheDocument()
  })

  it('should not display header while questions are loading', () => {
    testStore.dispatch(updateIsLoadingQuestions(true))
    renderDefaultComponent()
    expect(screen.queryByText('Kompletteringsbegäran')).not.toBeInTheDocument()
  })

  it('displays number of unhandled questions in the complement questions header if signed certificate', () => {
    const certificate = createCertificate({ status: CertificateStatus.SIGNED } as CertificateMetadata)
    testStore.dispatch(updateCertificate(certificate))
    testStore.dispatch(updateQuestions([addComplementsToQuestion(createQuestion(false)), addComplementsToQuestion(createQuestion())]))

    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).getByText('1')
    expect(numberOfQuestions).toBeInTheDocument()
  })

  it('displays no number of unhandled questions in the complement questions header if unsigned certificate', () => {
    const certificate = createCertificate({ status: CertificateStatus.UNSIGNED } as CertificateMetadata)
    testStore.dispatch(updateCertificate(certificate))
    testStore.dispatch(updateQuestions([addComplementsToQuestion(createQuestion(false)), addComplementsToQuestion(createQuestion())]))

    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).queryByText('1')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays no number of questions in the complement questions header', () => {
    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays no number of questions in the complement questions header if all questions are handled', () => {
    testStore.dispatch(updateQuestions([addComplementsToQuestion(createQuestion()), addComplementsToQuestion(createQuestion())]))
    renderDefaultComponent()

    const component = screen.getByText('Kompletteringsbegäran')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays number of questions in the administrative questions header', () => {
    renderDefaultComponent()
    expect(screen.getByText('Administrativa frågor')).toBeInTheDocument()
  })

  it('displays number of unhandled questions in the administrative questions header if signed certificate', () => {
    const certificate = createCertificate({ status: CertificateStatus.SIGNED } as CertificateMetadata)
    testStore.dispatch(updateCertificate(certificate))
    testStore.dispatch(updateQuestions([createQuestion(false), createQuestion()]))
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).getByText('1')
    expect(numberOfQuestions).toBeInTheDocument()
  })

  it('displays no number of unhandled questions in the administrative questions header if unsigned certificate', () => {
    const certificate = createCertificate({ status: CertificateStatus.UNSIGNED } as CertificateMetadata)
    testStore.dispatch(updateCertificate(certificate))
    testStore.dispatch(updateQuestions([createQuestion(false), createQuestion()]))
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).queryByText('1')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays no number of questions in the administrative questions header', () => {
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('displays no number of questions in the administrative questions header if all questions are handled', () => {
    testStore.dispatch(updateQuestions([createQuestion(), createQuestion()]))
    renderDefaultComponent()

    const component = screen.getByText('Administrativa frågor')
    const numberOfQuestions = within(component).queryByText('0')
    expect(numberOfQuestions).not.toBeInTheDocument()
  })

  it('should display error message if questions could not be fetched', () => {
    testStore.dispatch(setErrorId('errorId'))
    renderDefaultComponent()
    expect(screen.getByText('Ärenden kunde inte visas')).toBeInTheDocument()
  })

  it('should render complement tab', () => {
    renderDefaultComponent()
    expect(screen.getByText('Kompletteringsbegäran')).toBeInTheDocument()
  })

  it('should render questions tab', () => {
    renderDefaultComponent()
    expect(screen.getByText('Administrativa frågor')).toBeInTheDocument()
  })

  it('should show complement tab as default', () => {
    renderDefaultComponent()
    expect(screen.getByText('Det finns ingen kompletteringsbegäran på detta intyg.')).toBeInTheDocument()
  })

  it('should allow user to switch tab', () => {
    renderDefaultComponent()
    userEvent.click(screen.getByText('Administrativa frågor'))
    expect(screen.getByText('Det finns inga administrativa frågor för detta intyg.')).toBeInTheDocument()
  })
})

const createCertificate = (metadata: CertificateMetadata): Certificate =>
  (({
    metadata,
    links: [],
  } as unknown) as Certificate)

function createQuestion(handled = true): Question {
  return {
    author: 'author',
    id: String(Math.random()),
    forwarded: true,
    handled: handled,
    lastUpdate: '2021-07-08',
    message: 'message',
    sent: '2021-07-08',
    complements: [],
    subject: 'subject',
    reminders: [],
    type: QuestionType.COORDINATION,
    links: [],
  }
}

const addComplementsToQuestion = (question: Question): Question => {
  return {
    ...question,
    type: QuestionType.COMPLEMENT,
    complements: [{ questionId: 'questionId', valueId: 'valueId', questionText: 'questionText', message: 'complementMessage' }],
  } as Question
}
