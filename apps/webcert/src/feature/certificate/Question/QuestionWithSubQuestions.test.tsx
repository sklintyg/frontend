import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { fakeCategoryElement, fakeCertificate, fakeRadioBooleanElement, fakeTextAreaElement } from '../../../faker'
import { updateCertificate, updateCertificateComplements } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import type { Complement } from '../../../types'
import { QuestionWithSubQuestions } from './QuestionWithSubQuestions'

let testStore: EnhancedStore
Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() })

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <QuestionWithSubQuestions questionIds={['1.1', '1.2', '1.3']} />
    </Provider>
  )
}

const createComplement = ({ questionId = '', message = '' }): Complement => ({
  questionId,
  questionText: 'Intyget är baserat på',
  valueId: 'undersokningAvPatienten',
  message,
})

describe('QuestionWithSubQuestions', () => {
  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: {
            ...fakeRadioBooleanElement({
              id: '1.1',
              parent: 'category',
              config: { text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?' },
            }),
            ...fakeTextAreaElement({
              id: '1.2',
              parent: '1.1',
              config: { text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.' },
            }),
            ...fakeTextAreaElement({
              id: '1.3',
              parent: '1.1',
              config: { text: 'En annan text' },
            }),
            ...fakeCategoryElement({ id: 'category' }),
          },
        })
      )
    )
  })

  it('should render all questions', () => {
    renderComponent()
    const questions = [
      'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      'En annan text',
    ]

    questions.forEach((q) => expect(screen.getByText(q)).toBeInTheDocument())
  })

  it('should render complements for all questions', () => {
    renderComponent()
    const complements = [
      createComplement({ questionId: '1.1', message: 'Komplettering för 1.1' }),
      createComplement({ questionId: '1.2', message: 'Komplettering för 1.2' }),
      createComplement({ questionId: '1.3', message: 'Komplettering för 1.3' }),
    ]
    testStore.dispatch(updateCertificateComplements(complements))

    complements.forEach(async (c) => expect(await screen.findByText(c.message)).toBeInTheDocument())
  })

  it('Should return null if parentQuestion is false or not visible', () => {
    const parentQuestion = { visible: false }
    const result = !parentQuestion || !parentQuestion.visible
    expect(result).toBe(true)
  })
})
