import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeTextAreaElement } from '../../../faker'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { MessageLevel } from '../../../types'
import Question from './Question'

const QUESTION_ID = 'QUESTION_ID'

let testStore: EnhancedStore

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])
})

function renderComponent() {
  render(
    <Provider store={testStore}>
      <Question id={QUESTION_ID} />
    </Provider>
  )
}

it('Should display message', () => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...fakeTextAreaElement({ id: QUESTION_ID, config: { message: { level: MessageLevel.INFO, content: 'Some message content' } } }),
        },
      })
    )
  )
  renderComponent()
  expect(screen.getByText('Some message content')).toBeInTheDocument()
})

it('Should hide message when question is readOnly', () => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...fakeTextAreaElement({
            id: QUESTION_ID,
            config: { message: { level: MessageLevel.INFO, content: 'Some message content' } },
            readOnly: true,
          }),
        },
      })
    )
  )
  renderComponent()
  expect(screen.queryByText('Some message content')).not.toBeInTheDocument()
})
