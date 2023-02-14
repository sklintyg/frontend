import { fakeCategoryElement, fakeCertificate } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import Category from './Category'

let testStore: EnhancedStore
const CATEGORY_ID = 'categoryId'

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <Category id={CATEGORY_ID} />
    </Provider>
  )
}

describe('Category', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('should render description', () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: fakeCategoryElement({
            id: CATEGORY_ID,
            config: {
              text: 'Sjukdomens konsekvenser',
              description: 'En annan beskrivning',
            },
          }),
        })
      )
    )
    renderComponent()

    expect(screen.getByText('En annan beskrivning')).toBeInTheDocument()
  })

  it('should not render description if question is disabled', () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: fakeCategoryElement({
            id: CATEGORY_ID,
            disabled: true,
            config: {
              text: 'Sjukdomens konsekvenser',
              description: 'En annan beskrivning',
            },
          }),
        })
      )
    )
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })

  it('should not render description if question is read only', () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: fakeCategoryElement({
            id: CATEGORY_ID,
            readOnly: true,
            config: {
              text: 'Sjukdomens konsekvenser',
              description: 'En annan beskrivning',
            },
          }),
        })
      )
    )
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })

  it('should not render description if description is missing', () => {
    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: fakeCategoryElement({
            id: CATEGORY_ID,
            config: {
              text: 'Sjukdomens konsekvenser',
              description: '',
            },
          }),
        })
      )
    )
    renderComponent()

    expect(screen.queryByText('En annan beskrivning')).toBeNull()
  })
})
