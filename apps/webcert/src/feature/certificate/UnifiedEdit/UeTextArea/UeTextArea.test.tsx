import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeTextArea from './UeTextArea'
import { fakeTextAreaElement, fakeTextValidation } from '../../../../faker'

let testStore: EnhancedStore
let modalRoot: HTMLDivElement

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
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('renders a textarea which has correct value after typing in it', async () => {
    const mockQuestion = fakeTextAreaElement({ id: '1', value: { text: null } })['1']

    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello, World!')
    await expect(input).toHaveValue('Hello, World!')
    // TODO: Perhaps this will work if we update our testing packages. Can't break to new lines currently
    //   userEvent.type(input, 'Hello,{enter}World!')
    //   expect(input).toHaveValue('Hello,\nWorld!')
  })

  it('should show character counter if text validation is set', () => {
    const mockQuestion = fakeTextAreaElement({
      id: '1',
      value: { text: null },
      validation: [
        fakeTextValidation({
          questionId: 'id',
          limit: 100,
        }),
      ],
    })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    expect(screen.getByText('0 av 100 tecken', { exact: false })).toBeInTheDocument()
  })

  it('should remove unsupported characters and show the warning InfoBox', async () => {
    const mockQuestion = fakeTextAreaElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello 😀')
    await userEvent.tab()

    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()
  })

  it('should hide the warning InfoBox when the user starts editing again', async () => {
    const mockQuestion = fakeTextAreaElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello 😀')
    await userEvent.tab()
    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()

    await userEvent.type(input, 'a')
    expect(screen.queryByText(/Tecken som inte stöds/, { exact: false })).not.toBeInTheDocument()
  })
})
