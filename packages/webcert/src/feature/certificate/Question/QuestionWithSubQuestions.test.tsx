import { Complement, fakeCertificate, fakeTextFieldElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate, updateCertificateComplements } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { QuestionWithSubQuestions } from './QuestionWithSubQuestions'

let testStore: EnhancedStore
window.scrollTo = jest.fn()

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
            ...fakeTextFieldElement({
              id: '1.1',
              config: {
                text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
              },
            }),
            ...fakeTextFieldElement({
              id: '1.2',
              config: {
                text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
              },
            }),
            ...fakeTextFieldElement({
              id: '1.3',
              config: {
                text: 'En annan text',
              },
            }),
          },
        })
      )
    )
    renderComponent()
  })

  it.each([
    'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
    'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
    'En annan text',
  ])('Should render question %#', (text) => {
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it.each([
    createComplement({ questionId: '1.1', message: 'Komplettering för 1.1' }),
    createComplement({ questionId: '1.2', message: 'Komplettering för 1.2' }),
    createComplement({ questionId: '1.3', message: 'Komplettering för 1.3' }),
  ])('Should render complements for question %#', (complement) => {
    testStore.dispatch(updateCertificateComplements([complement]))
    expect(screen.getByText(complement.message)).toBeInTheDocument()
  })

  it('Should return null if parentQuestion is false or not visible', () => {
    const parentQuestion = { visible: false }
    const result = !parentQuestion || !parentQuestion.visible
    expect(result).toBe(true)
  })
})
