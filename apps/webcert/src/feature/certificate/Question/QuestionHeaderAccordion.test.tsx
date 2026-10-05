import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import {
  fakeCertificate,
  fakeCertificateConfig,
  fakeCertificateValidationError,
  fakeCategoryElement,
  fakeTextFieldElement,
} from '../../../faker'
import { showValidationErrors, updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import QuestionHeaderAccordion from './QuestionHeaderAccordion'

let testStore: EnhancedStore

function renderComponent(props: ComponentProps<typeof QuestionHeaderAccordion>) {
  return render(
    <Provider store={testStore}>
      <QuestionHeaderAccordion {...props} />
    </Provider>
  )
}

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])
})

it('Should have accordion when there is a description', () => {
  renderComponent({
    config: fakeCertificateConfig.textArea({ header: 'My header', description: 'Some description' }),
    displayMandatory: false,
    questionId: '1',
  })

  expect(screen.getByRole('heading', { name: 'My header', level: 4 })).toBeInTheDocument()
  expect(screen.getByRole('group')).toBeInTheDocument()
})

it('Should not have accordion when there is no description', () => {
  renderComponent({
    config: fakeCertificateConfig.textArea({ header: 'My header', description: undefined }),
    displayMandatory: false,
    questionId: '1',
  })

  expect(screen.getByRole('heading', { name: 'My header', level: 4 })).toBeInTheDocument()
  expect(screen.queryByRole('group')).not.toBeInTheDocument()
})

it('Should display mandatory icon', () => {
  renderComponent({
    config: fakeCertificateConfig.textArea({ header: 'My header', description: 'Some description' }),
    displayMandatory: true,
    questionId: '1',
  })

  expect(screen.getByTestId('mandatory-icon')).toBeInTheDocument()
})

it('Should display mandatory icon when description is missing', () => {
  renderComponent({
    config: fakeCertificateConfig.textArea({ header: 'My header', description: undefined }),
    displayMandatory: true,
    questionId: '1',
  })

  expect(screen.getByTestId('mandatory-icon')).toBeInTheDocument()
})

it.each([
  { parentType: 'category', description: 'Some description', expectedColor: '#c12143' },
  { parentType: 'category', description: undefined, expectedColor: '#c12143' },
  { parentType: 'question', description: 'Some description', expectedColor: 'transparent' },
  { parentType: 'question', description: undefined, expectedColor: 'transparent' },
])('Should highlight validation errors only when the parent is a category ($parentType, description: $description)', ({
  parentType,
  description,
  expectedColor,
}) => {
  const validationError = fakeCertificateValidationError({ id: '1' })
  const parent =
    parentType === 'category'
      ? fakeCategoryElement({ id: '1', validationErrors: [validationError] })['1']
      : fakeTextFieldElement({ id: '1', validationErrors: [validationError] })['1']

  testStore.dispatch(updateCertificate(fakeCertificate({ data: { [parent.id]: parent } })))
  testStore.dispatch(showValidationErrors())

  renderComponent({
    config: fakeCertificateConfig.textArea({ text: 'Question', description }),
    displayMandatory: false,
    questionId: parent.id,
  })

  const headerHighlight = screen.getByTestId('question-header-error-highlight')
  expect(headerHighlight).toHaveStyle(`border-bottom-color: ${expectedColor}`)
})
