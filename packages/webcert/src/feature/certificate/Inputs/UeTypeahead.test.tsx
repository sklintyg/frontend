import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import UeTypeahead from './UeTypeahead'
import { fakeTypeaheadElement } from '@frontend/common'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

const defaultOnChange = jest.fn()
const defaultOnSuggestionSelected = jest.fn()
const defaultOnClose = jest.fn()

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

const mockQuestion = fakeTypeaheadElement({ id: '1' })['1']

it('renders without crashing', () => {
  render(<UeTypeahead question={mockQuestion} disabled={false} />)
})

it('does not render suggestions when array is empty', () => {
  render(<UeTypeahead question={mockQuestion} disabled={true} />)
  const list = screen.queryByRole('list')
  expect(list).toBeNull()
})

it('does not render suggestions when open is false', () => {
  render(<UeTypeahead question={mockQuestion} disabled={false} />)
  const list = screen.queryByRole('list')
  expect(list).toBeNull()
})

it("closes list if input doesn't have focus", () => {
  render(<UeTypeahead question={mockQuestion} disabled={false} />)
  render(<button></button>)
  const button = screen.getByRole('button')
  const input = screen.getByRole('textbox')
  expect(defaultOnClose).toHaveBeenCalledTimes(0)
  userEvent.click(input)
  userEvent.click(button)
  expect(defaultOnClose).toHaveBeenCalledTimes(1)
})

// it('allows user to navigate list through hover or arrow keys', async () => {
//   render(<UeTypeahead question={mockQuestion} disabled={false} />)
//   userEvent.click(screen.getByRole('textbox'))
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
//   await userEvent.keyboard('{arrowDown}')
//   await userEvent.keyboard('{arrowDown}')
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
//   userEvent.keyboard('{enter}')
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
//   expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[2].label)
//   userEvent.keyboard('{arrowUp}')
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
//   userEvent.keyboard('{enter}')
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(2)
//   expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(2, suggestions[1].label)
//   userEvent.hover(screen.getAllByRole('option')[0])
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(2)
//   userEvent.keyboard('{enter}')
//   expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(3)
//   expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(3, mockQuestion.typeahead[0].label)
// })

it('does not allow user to choose disabled option', () => {
  render(<UeTypeahead question={mockQuestion} />)
  userEvent.click(screen.getByRole('textbox'))
  expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
  userEvent.keyboard('{arrowUp}')
  expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
  userEvent.keyboard('{enter}')
  expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
  userEvent.click(screen.getAllByRole('option')[3])
  expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
})

// it('closes list on escape key', () => {
//   render(<UeTypeahead question={mockQuestion} />)
//   userEvent.click(screen.getByRole('textbox'))
//   expect(defaultOnClose).toHaveBeenCalledTimes(0)
//   userEvent.keyboard('{arrowUp}')
//   userEvent.keyboard('{arrowDown}')
//   expect(defaultOnClose).toHaveBeenCalledTimes(0)
//   userEvent.keyboard('{escape}')
//   expect(defaultOnClose).toHaveBeenCalledTimes(1)
// })

// it('calls on change when user types in textbox', () => {
//   const string = 'test'
//   render(<UeTypeahead question={mockQuestion} disabled={false} />)
//   expect(defaultOnChange).toHaveBeenCalledTimes(0)
//   userEvent.type(screen.getByRole('textbox'), string)
//   expect(defaultOnChange).toHaveBeenCalledTimes(string.length)
// })
