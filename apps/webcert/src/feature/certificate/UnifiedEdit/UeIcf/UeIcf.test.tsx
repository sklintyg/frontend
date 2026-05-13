import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeICFDataElement } from '../../../../faker'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeIcf from './UeIcf'

let testStore: EnhancedStore
let modalRoot: HTMLDivElement

const renderDefaultComponent = (props: ComponentProps<typeof UeIcf>) => {
  render(
    <Provider store={testStore}>
      <UeIcf {...props} />
    </Provider>
  )
}

describe('UeIcf', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modalRoot')
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    document.body.removeChild(modalRoot)
  })

  it('renders a textarea', () => {
    const mockQuestion = fakeICFDataElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should remove unsupported characters and show the warning InfoBox', async () => {
    const mockQuestion = fakeICFDataElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Text 😀')

    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()
  })

  it('should hide the warning InfoBox when the field is cleared', async () => {
    const mockQuestion = fakeICFDataElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Text 😀')
    expect(screen.getByText(/Tecken som inte stöds/, { exact: false })).toBeInTheDocument()

    await userEvent.clear(input)
    expect(screen.queryByText(/Tecken som inte stöds/, { exact: false })).not.toBeInTheDocument()
  })

  it('should preserve valid text without triggering the warning', async () => {
    const mockQuestion = fakeICFDataElement({ id: '1', value: { text: null } })['1']
    renderDefaultComponent({ question: mockQuestion, disabled: false })

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Patienten har nedsatt rörlighet åäö')

    expect(screen.queryByText(/Tecken som inte stöds/, { exact: false })).not.toBeInTheDocument()
  })
})
