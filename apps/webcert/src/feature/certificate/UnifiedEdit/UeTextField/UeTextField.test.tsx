import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeTextFieldElement } from '../../../../faker'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeTextField from './UeTextField'

const mockQuestion = fakeTextFieldElement({ id: '1', value: { text: 'Text' } })['1']

let testStore: EnhancedStore
let modalRoot: HTMLDivElement

const renderDefaultComponent = (props: ComponentProps<typeof UeTextField>) => {
  render(
    <Provider store={testStore}>
      <UeTextField {...props} />
    </Provider>
  )
}

describe('UeTextField', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('renders component with correct default values', async () => {
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    const input = screen.getByRole('textbox')
    await expect(input).toHaveValue('Text')
  })

  it('renders a text which has correct value after typing in it', async () => {
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    const inputString = 'Hello, World'
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, inputString)
    await expect(input).toHaveValue(inputString)
  })

  it('disables component if disabled is set', async () => {
    renderDefaultComponent({ question: mockQuestion, disabled: true })
    const input = screen.getByRole('textbox')
    await expect(input).toBeDisabled()
  })

  it('should remove unsupported characters and show the warning InfoBox', async () => {
    const emptyQuestion = fakeTextFieldElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: emptyQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Text 😀')

    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()
  })

  it('should hide the warning InfoBox when the field is cleared', async () => {
    const emptyQuestion = fakeTextFieldElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: emptyQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Text 😀')
    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()

    await userEvent.clear(input)
    expect(screen.queryByText(/Tecken som inte stöds/, { exact: false })).not.toBeInTheDocument()
  })
})
