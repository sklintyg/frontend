import { getCategoryFunktionsnedsattning, getCertificateWithQuestion } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach } from 'vitest'
import Category from './Category'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Category id="funktionsnedsattning" />
    </Provider>
  )
}

describe('Category', () => {
  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

  it('should render description', () => {
    const question = getCategoryFunktionsnedsattning()

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.getByText('En annan beskrivning')).toBeInTheDocument()
  })

  it('should not render description if question is disabled', () => {
    const question = getCategoryFunktionsnedsattning()
    question.disabled = true

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })

  it('should not render description if question is read only', () => {
    const question = getCategoryFunktionsnedsattning()
    question.readOnly = true

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })

  it('should not render description if description is missing', () => {
    const question = getCategoryFunktionsnedsattning()
    question.config.description = ''

    testStore.dispatch(updateCertificate(getCertificateWithQuestion(question)))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })
})
