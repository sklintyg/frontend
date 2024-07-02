import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeTextArea from '../UeTextArea/UeTextArea'
import type UeTextField from './UeTextField'
import { fakeTextFieldElement } from '../../../../faker'

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

  it('disables component if disabled is set', () => {
    renderDefaultComponent({ question: mockQuestion, disabled: true })
    const input = screen.getByRole('textbox')
    await expect(input).toBeDisabled()
  })
})
