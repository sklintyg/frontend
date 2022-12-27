import { fakeTextFieldElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import * as redux from 'react-redux'
import UeTextField from '../UeTextField'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

const mockQuestion = fakeTextFieldElement({ id: '1', value: { text: 'Text' } })['1']

it('renders component with correct default values', () => {
  render(<UeTextField question={mockQuestion} disabled={false} />)
  const input = screen.getByRole('textbox')
  expect(input).toHaveValue('Text')
})

it('renders a text which has correct value after typing in it', async () => {
  render(<UeTextField question={mockQuestion} disabled={false} />)
  const inputString = 'Hello, World'
  const input = screen.getByRole('textbox')
  userEvent.clear(input)
  userEvent.type(input, inputString)
  expect(input).toHaveValue(inputString)
})

it('disables component if disabled is set', () => {
  render(<UeTextField question={mockQuestion} disabled={true} />)
  const input = screen.getByRole('textbox')
  expect(input).toBeDisabled()
})
