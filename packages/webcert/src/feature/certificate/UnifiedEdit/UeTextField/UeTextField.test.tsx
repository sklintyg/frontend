import { fakeTextFieldElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import UeTextField from './UeTextField'
import { EnhancedStore, configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import UeTextArea from '../UeTextArea/UeTextArea'
import reducers from '../../../../store/reducers'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'

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
    testStore = configureStore({
      reducer: reducers,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
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
    userEvent.clear(input)
    userEvent.type(input, inputString)
    expect(input).toHaveValue(inputString)
  })

  it('disables component if disabled is set', () => {
    renderDefaultComponent({ question: mockQuestion, disabled: true })
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })
})
