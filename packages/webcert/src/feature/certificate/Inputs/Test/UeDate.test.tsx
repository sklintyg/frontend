import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeDate from '../UeDate'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import { fakeDateElement } from '@frontend/common'

const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'
const QUESTION_ID = 'datepicker'

const question = fakeDateElement({ id: QUESTION_ID })[QUESTION_ID]

const renderComponent = (disabled: boolean) => {
  render(
    <>
      <Provider store={store}>
        <UeDate question={question} disabled={disabled} />
      </Provider>
    </>
  )
}

describe('DatePicker component', () => {
  it('renders without crashing', () => {
    renderComponent(false)
  })

  it('renders textinput and calendar button', () => {
    renderComponent(false)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent(true)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', () => {
    renderComponent(false)

    const inputDate = '20220929'
    const expected = '2022-09-29'
    const input = screen.getByRole('textbox')

    userEvent.type(input, inputDate)
    expect(input).toHaveValue(expected)
  })

  it('should display error when input is not a complete date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, '2020-01')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should display error when input is not a valid date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'test')
    userEvent.tab()
    expect(screen.getByText(INVALID_DATE_MESSAGE)).toBeInTheDocument()
  })

  it('should not display error when input is a valid date', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    userEvent.type(input, '20200101')
    userEvent.tab()
    expect(screen.queryByText(INVALID_DATE_MESSAGE)).not.toBeInTheDocument()
  })

  it('renders component with correct default values', () => {
    renderComponent(false)
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toHaveValue('2022-09-29')
    expect(button).toHaveValue('2022-09-29')
  })
})
