import { fakeTextFieldElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeTextArea from '../UeTextArea/UeTextArea'
import UeTextField from './UeTextField'

const mockQuestion = fakeTextFieldElement({ id: '1', value: { text: 'Text' } })['1']

let testStore: EnhancedStore

const renderDefaultComponent = (props: ComponentProps<typeof UeTextField>) => {
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

  it('renders component with correct default values', () => {
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Text')
  })

  it('renders a text which has correct value after typing in it', async () => {
    renderDefaultComponent({ question: mockQuestion, disabled: false })
    const inputString = 'Hello, World'
    const input = screen.getByRole('textbox')
    await act(() => userEvent.clear(input))
    await act(() => userEvent.type(input, inputString))
    expect(input).toHaveValue(inputString)
  })

  it('disables component if disabled is set', () => {
    renderDefaultComponent({ question: mockQuestion, disabled: true })
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })
})
