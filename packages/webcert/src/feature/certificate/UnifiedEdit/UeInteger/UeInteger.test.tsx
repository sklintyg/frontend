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
const VALIDATION_ERROR = 'Ange ett nummer mellan 0 och 100.'
const QUESTION_ID = 'percent'
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

  it('should not allow bigger than three digits', () => {
    renderComponent({ disabled: false, question })

    userEvent.type(screen.getByTestId('reducedPercent'), '199')

    expect(screen.getByTestId('reducedPercent')).not.toHaveValue('')
  })

  it('should not allow letters', () => {
    renderComponent({ disabled: false, question })

    userEvent.type(screen.getByTestId('reducedPercent'), 'ABC')

    expect(screen.getByTestId('reducedPercent')).not.toHaveValue('ABC')
  })

  it('should allow numbers smaller than 100', () => {
    renderComponent({ disabled: false, question })

    userEvent.type(screen.getByTestId('reducedPercent'), '99')

    expect(screen.getByTestId('reducedPercent')).toHaveValue('99')
  })
})
