import { fakeIntegerElement } from '@frontend/common'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import UeInteger from './UeInteger'
import reducer from '../../../../store/reducers'

let testStore: EnhancedStore
const QUESTION_ID = 'number'
const testValue = 199
const question = fakeIntegerElement({ id: QUESTION_ID, value: { value: testValue } })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeInteger>) => {
  render(
    <>
      <Provider store={testStore}>
        <UeInteger {...props} />
      </Provider>
    </>
  )
}
describe('Integer component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(certificateMiddleware),
    })
  })

  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })

  it('renders textinput ', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should not allow numbers bigger than three digits', () => {
    renderComponent({ disabled: false, question })

    userEvent.type(screen.getByTestId('testNumber'), '199')

    expect(screen.getByTestId('testNumber')).not.toHaveValue('')
  })

  it('should not allow letters', () => {
    renderComponent({ disabled: false, question })

    userEvent.type(screen.getByTestId('testNumber'), 'ABC')

    expect(screen.getByTestId('testNumber')).not.toHaveValue('ABC')
  })
})
