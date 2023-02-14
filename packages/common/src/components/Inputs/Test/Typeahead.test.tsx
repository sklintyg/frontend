import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Typeahead from '../Typeahead'

const suggestions = [
  { label: 'Hello, World!', disabled: false, title: null },
  { label: 'Suggestion 2', disabled: false, title: null },
  { label: 'Test', disabled: false, title: null },
  { label: 'String', disabled: true, title: null },
]
const defaultOnChange = jest.fn()
const defaultOnSuggestionSelected = jest.fn()
const defaultOnClose = jest.fn()

const renderDefaultComponent = () => {
  render(
    <Typeahead
      ref={null}
      onChange={defaultOnChange}
      onSuggestionSelected={defaultOnSuggestionSelected}
      open={false}
      suggestions={[]}
      onClose={defaultOnClose}
    />
  )
}

afterEach(() => {
  jest.clearAllMocks()
})

const renderWithSuggestions = (open: boolean, moreResults: boolean) => {
  render(
    <Typeahead
      onChange={defaultOnChange}
      onSuggestionSelected={defaultOnSuggestionSelected}
      open={open}
      suggestions={suggestions}
      moreResults={moreResults}
      onClose={defaultOnClose}
    />
  )
}

describe('Typeahead component', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('does not render suggestions when array is empty', () => {
    renderDefaultComponent()
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })

  it('does not render suggestions when open is false', () => {
    renderWithSuggestions(false, false)
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })

  it('renders suggestions when open is true', () => {
    renderWithSuggestions(true, false)
    const listItems = screen.queryAllByRole('option')
    expect(listItems).toHaveLength(suggestions.length)
    suggestions.forEach((s) => expect(screen.queryByText(s.label)).not.toBeNull())
  })

  it("closes list if input doesn't have focus", () => {
    renderDefaultComponent()
    render(<button></button>)
    const button = screen.getByRole('button')
    const input = screen.getByRole('textbox')
    expect(defaultOnClose).toHaveBeenCalledTimes(0)
    userEvent.click(input)
    userEvent.click(button)
    expect(defaultOnClose).toHaveBeenCalledTimes(1)
  })

  it('shows information suggestion if there are more results', () => {
    renderWithSuggestions(true, true)
    const listItems = screen.queryAllByRole('option')
    const moreItem = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(suggestions.length)
    expect(moreItem).toHaveLength(1)
  })

  it('allows user to choose option using click or enter key', () => {
    renderWithSuggestions(true, false)
    userEvent.click(screen.getByRole('textbox'))
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
    userEvent.click(screen.getAllByRole('option')[1])
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(2)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(2, suggestions[1].label)
  })

  it('allows user to choose option using tab', () => {
    renderWithSuggestions(true, false)
    userEvent.click(screen.getByRole('textbox'))
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
  })

  it('allows user to navigate list through hover or arrow keys', async () => {
    renderWithSuggestions(true, false)
    userEvent.click(screen.getByRole('textbox'))
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    await userEvent.keyboard('{arrowDown}')
    await userEvent.keyboard('{arrowDown}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[2].label)
    userEvent.keyboard('{arrowUp}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(1)
    userEvent.keyboard('{enter}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(2)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(2, suggestions[1].label)
    userEvent.hover(screen.getAllByRole('option')[0])
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(2)
    userEvent.keyboard('{enter}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(3)
    expect(defaultOnSuggestionSelected).toHaveBeenNthCalledWith(3, suggestions[0].label)
  })

  it('does not allow user to choose disabled option', () => {
    renderWithSuggestions(true, false)
    userEvent.click(screen.getByRole('textbox'))
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{arrowUp}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.click(screen.getAllByRole('option')[3])
    expect(defaultOnSuggestionSelected).toHaveBeenCalledTimes(0)
  })

  it('closes list on escape key', () => {
    renderWithSuggestions(true, false)
    userEvent.click(screen.getByRole('textbox'))
    expect(defaultOnClose).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{arrowUp}')
    userEvent.keyboard('{arrowDown}')
    expect(defaultOnClose).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{escape}')
    expect(defaultOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls on change when user types in textbox', () => {
    const string = 'test'
    renderWithSuggestions(false, false)
    expect(defaultOnChange).toHaveBeenCalledTimes(0)
    userEvent.type(screen.getByRole('textbox'), string)
    expect(defaultOnChange).toHaveBeenCalledTimes(string.length)
  })
})
