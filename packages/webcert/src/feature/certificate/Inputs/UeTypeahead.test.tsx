import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import UeTypeahead from './UeTypeahead'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import { fakeTypeaheadElement } from '@frontend/common'

const question = fakeTypeaheadElement({ id: '1' })['1']

const renderDefaultComponent = () => {
  render(
    <>
      <UeTypeahead question={question} disabled={false} />
    </>
  )
}

const renderWithSuggestions = () => {
  render(
    <>
      <UeTypeahead question={question} disabled={true} />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue({})
  useDispatchSpy.mockReturnValue(jest.fn())
})

const checkListVisibility = (visible: boolean) => {
  const listItems = screen.queryAllByRole('option')
  if (visible) {
    expect(listItems).toHaveLength(2)
  } else {
    expect(listItems).toHaveLength(0)
  }
}

describe('Typeahead component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })
  it('does not render suggestions when array is empty', () => {
    renderDefaultComponent()
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })

  it('disables component if disabled is set', () => {
    renderWithSuggestions()
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })
  it('shows results when users types text', () => {
    renderDefaultComponent()
    const testinput = 'Ö'
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    checkListVisibility(false)
    userEvent.type(input, testinput)
    checkListVisibility(true)
    expect(input).toHaveValue(testinput)
    checkListVisibility(true)
  })
})
