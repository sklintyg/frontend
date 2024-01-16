import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeInteger from './UeInteger'
import { fakeIntegerElement } from '../../../../faker'

let testStore: EnhancedStore
const QUESTION_ID = 'number'
const testValue = 199
const question = fakeIntegerElement({ id: QUESTION_ID, value: { value: testValue } })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeInteger>) => {
  render(
    <Provider store={testStore}>
      <UeInteger {...props} />
    </Provider>
  )
}
describe('Integer component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderComponent({ disabled: false, question })).not.toThrow()
  })

  it('renders textinput', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should not allow numbers bigger than three digits', async () => {
    renderComponent({ disabled: false, question })

    await userEvent.type(screen.getByTestId('testNumber'), '199')

    expect(screen.getByTestId('testNumber')).not.toHaveValue('')
  })

  it('should not allow letters', async () => {
    renderComponent({ disabled: false, question })

    await userEvent.type(screen.getByTestId('testNumber'), 'ABC')

    expect(screen.getByTestId('testNumber')).not.toHaveValue('ABC')
  })

  it('should not allow strings starting with numbers and containing other characters', async () => {
    renderComponent({ disabled: false, question })

    await userEvent.type(screen.getByTestId('testNumber'), '012')

    expect(screen.getByTestId('testNumber')).not.toHaveValue('012')
  })
})
