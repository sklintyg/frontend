import { CertificateDataValidationType, fakeCertificateDataValidation, fakeTextAreaElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeTextArea from './UeTextArea'

let testStore: EnhancedStore

const renderDefaultComponent = (props: ComponentProps<typeof UeTextArea>) => {
  render(
    <Provider store={testStore}>
      <UeTextArea {...props} />
    </Provider>
  )
}

describe('UeTextArea', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders a textarea which has correct value after typing in it', async () => {
    const mockQuestion = fakeTextAreaElement({ id: '1', value: { text: null } })['1']

    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await act(() => userEvent.type(input, 'Hello, World!'))
    expect(input).toHaveValue('Hello, World!')
  })

  it('should show character counter if text validation is set', () => {
    const mockQuestion = fakeTextAreaElement({
      id: '1',
      value: { text: null },
      validation: [
        fakeCertificateDataValidation({
          type: CertificateDataValidationType.TEXT_VALIDATION,
          questionId: 'id',
          limit: 100,
        }),
      ],
    })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    expect(screen.getByText('0 av 100 tecken', { exact: false })).toBeInTheDocument()
  })
})
