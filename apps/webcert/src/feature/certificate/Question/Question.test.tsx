import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCheckboxBooleanElement, fakeTextAreaElement } from '../../../faker'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { ConfigTypes, MessageLevel } from '../../../types'
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

it('Should hide question header accordion when text is not present', () => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...fakeCheckboxBooleanElement({
            id: 'id',
            value: { selected: true },
            config: {
              selectedText: 'Boolean value = true',
              unselectedText: 'Boolean value = false',
              label: 'This is the label',
            },
          }),
        },
      })
    )
  )
  renderComponent()
  expect(screen.queryByTestId('question-heading-h5')).not.toBeInTheDocument()
})

it('Should display question header accordion when text is present', () => {
  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...fakeTextAreaElement({
            id: QUESTION_ID,
            config: { type: ConfigTypes.UE_TEXTAREA, text: 'Some text', description: 'Some description' },
          }),
        },
      })
    )
  )
  renderComponent()
  expect(screen.getByTestId("question-heading-h5")).toBeInTheDocument()
})
