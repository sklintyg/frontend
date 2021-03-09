import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Typeahead from '../Typeahead'

const suggestions = ['Hello, World!', 'Suggestion 2', 'Test', 'String']
const defaultOnChange = jest.fn()
const defaultOnSuggestionSelected = jest.fn()
const defaultOnClose = jest.fn()

const renderDefaultComponent = () => {
  render(
    <Typeahead
      onChange={defaultOnChange}
      onSuggestionSelected={defaultOnSuggestionSelected}
      open={false}
      suggestions={[]}
      onClose={defaultOnClose}
    />
  )
}

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
    renderDefaultComponent()
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
    const listItems = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(suggestions.length)
    suggestions.forEach((s) => expect(screen.queryByText(s)).not.toBeNull())
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
    const listItems = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(suggestions.length + 1)
  })
})
