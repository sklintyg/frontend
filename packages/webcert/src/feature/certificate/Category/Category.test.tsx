import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import reducer from '../../../store/reducers'
import Category from './Category'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { getCertificateWithQuestion, getCategoryFunktionsnedsattning } from '@frontend/common'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Category id="questionId" />
    </Provider>
  )
}

describe('Category', () => {
  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(dispatchHelperMiddleware, certificateMiddleware),
    })
  })

  it('should render description', () => {
    const question = getCategoryFunktionsnedsattning()

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeNull()
  })

  it('should not render description if question is disabled', () => {
    const question = getCategoryFunktionsnedsattning()
    question.disabled = true

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })

  it('should not render description if question is read only', () => {
    const question = getCategoryFunktionsnedsattning()
    question.readOnly = true

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })

  it('should not render description if description is missing', () => {
    const question = getCategoryFunktionsnedsattning()
    question.config.description = ''

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })
})
