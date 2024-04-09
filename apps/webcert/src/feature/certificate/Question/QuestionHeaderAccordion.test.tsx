import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificateConfig } from '../../../faker'
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
