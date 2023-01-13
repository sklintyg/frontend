import React, { ComponentProps } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Typeahead, { Suggestion } from './Typeahead'

const suggestions: Suggestion[] = [
  { label: 'Hello, World!', disabled: false, title: null },
  { label: 'Suggestion 2', disabled: false, title: null },
  { label: 'Test', disabled: false, title: null },
  { label: 'String', disabled: true, title: null },
]

const renderComponent = ({ ...args }: Partial<ComponentProps<typeof Typeahead>>) => {
  return render(<Typeahead onSuggestionSelected={jest.fn()} suggestions={[]} onClose={jest.fn()} {...args} />)
}

describe('Typeahead component', () => {
  it('Should render without crashing', () => {
    expect(() => renderComponent({})).not.toThrow()
  })

  it('Should not render suggestions when array is empty', () => {
    renderComponent({})
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })

  it('Should not render suggestions when open is false', () => {
    renderComponent({ moreResults: false, suggestions })
    const list = screen.queryByRole('list')
    expect(list).toBeNull()
  })

  it('Should renders suggestions when open is true', () => {
    renderComponent({ moreResults: false, suggestions })
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.queryAllByRole('option')).toHaveLength(suggestions.length)
    suggestions.forEach((s) => expect(screen.queryByText(s.label)).not.toBeNull())
  })

  it("Should close list if input doesn't have focus", () => {
    const onClose = jest.fn()
    renderComponent({ onClose })
    render(<button></button>)
    expect(onClose).toHaveBeenCalledTimes(0)
    userEvent.click(screen.getByRole('textbox'))
    userEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Should show information suggestion if there are more results', () => {
    renderComponent({ moreResults: true, suggestions })
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.queryAllByRole('option')).toHaveLength(suggestions.length)
    expect(screen.queryAllByRole('listitem')).toHaveLength(1)
  })

  it('Should allow user to choose option using click or enter key', () => {
    const onSuggestionSelected = jest.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
    userEvent.click(screen.getAllByRole('option')[1])
    expect(onSuggestionSelected).toHaveBeenCalledTimes(2)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(2, suggestions[1].label)
  })

  it('Should allow user to choose option using tab', () => {
    const onSuggestionSelected = jest.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
  })

  it('Should allow user to navigate list through hover or arrow keys', () => {
    const onSuggestionSelected = jest.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{arrowDown}')
    userEvent.keyboard('{arrowDown}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[2].label)
    userEvent.keyboard('{arrowUp}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(2)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(2, suggestions[1].label)
    userEvent.hover(screen.getAllByRole('option')[0])
    expect(onSuggestionSelected).toHaveBeenCalledTimes(2)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(3)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(3, suggestions[0].label)
  })

  it('Should not allow user to choose disabled option', () => {
    const onSuggestionSelected = jest.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{arrowUp}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.click(screen.getAllByRole('option')[3])
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
  })

  it('Should closes list on escape key', () => {
    const onClose = jest.fn()
    renderComponent({ moreResults: false, suggestions, onClose })
    userEvent.click(screen.getByRole('textbox'))
    expect(onClose).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{arrowUp}')
    userEvent.keyboard('{arrowDown}')
    expect(onClose).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Should calls on change when user types in textbox', () => {
    const onChange = jest.fn()
    renderComponent({ moreResults: false, suggestions, onChange })
    expect(onChange).toHaveBeenCalledTimes(0)
    userEvent.type(screen.getByRole('textbox'), 'test')
    expect(onChange).toHaveBeenCalledTimes(4)
  })
})
