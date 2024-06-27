import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCategoryElement, fakeCertificate } from '../../../faker'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { updateCertificate } from '../../../store/certificate/certificateSlice'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import Category from './Category'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Category id="category" />
    </Provider>
  )
}

describe('Category', () => {
  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

  it('should render description', () => {
    const element = fakeCategoryElement({ id: 'category', config: { description: 'En annan beskrivning' } })

    testStore.dispatch(updateCertificate(fakeCertificate({ data: { ...element } })))
    renderComponent()

    expect(screen.getByText('En annan beskrivning')).toBeInTheDocument()
  })

  it('should not render description if question is disabled', () => {
    const element = fakeCategoryElement({ id: 'category', disabled: true, config: { description: 'En annan beskrivning' } })

    testStore.dispatch(updateCertificate(fakeCertificate({ data: { ...element } })))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })

  it('should not render description if question is read only', () => {
    const element = fakeCategoryElement({ id: 'category', readOnly: true, config: { description: 'En annan beskrivning' } })

    testStore.dispatch(updateCertificate(fakeCertificate({ data: { ...element } })))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })

  it('should not render description if description is missing', () => {
    const element = fakeCategoryElement({ id: 'category', config: { description: '' } })

    testStore.dispatch(updateCertificate(fakeCertificate({ data: { ...element } })))
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).not.toBeInTheDocument()
  })
})
