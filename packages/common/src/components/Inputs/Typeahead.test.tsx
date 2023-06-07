import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { vi } from 'vitest'
import Typeahead, { Suggestion } from './Typeahead'

const suggestions: Suggestion[] = [
  { label: 'Hello, World!', disabled: false, title: null },
  { label: 'Suggestion 2', disabled: false, title: null },
  { label: 'Test', disabled: false, title: null },
  { label: 'String', disabled: true, title: null },
]

const renderComponent = ({ ...args }: Partial<ComponentProps<typeof Typeahead>>) => {
  return render(<Typeahead onSuggestionSelected={vi.fn()} suggestions={[]} onClose={vi.fn()} {...args} />)
}

describe('Typeahead component', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('Should render without crashing', () => {
    expect(() => renderComponent({})).not.toThrow()
  })

  it('Should not render suggestions when array is empty', () => {
    renderComponent({})
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('Should not render suggestions when open is false', () => {
    renderComponent({ moreResults: false, suggestions })
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('Should render suggestions when open is true', () => {
    renderComponent({ moreResults: false, suggestions })
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.queryAllByRole('option')).toHaveLength(suggestions.length)
    suggestions.forEach((s) => expect(screen.queryByText(s.label)).not.toBeNull())
  })

  it('Should select first suggestion when opened', () => {
    renderComponent({ moreResults: false, suggestions })
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.getByTestId('typeahead-list-option-0')).toHaveClass('iu-bg-main iu-color-white')
  })

  it('Should select first suggestion when re-opened', () => {
    renderComponent({ moreResults: false, suggestions })
    userEvent.click(screen.getByRole('textbox'))
    userEvent.keyboard('{arrowDown}')
    expect(screen.getByTestId('typeahead-list-option-1')).toHaveClass('iu-bg-main iu-color-white')
    userEvent.keyboard('{esc}')
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.getByTestId('typeahead-list-option-0')).toHaveClass('iu-bg-main iu-color-white')
  })

  it("Should close list if input doesn't have focus", () => {
    const onClose = vi.fn()
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
    expect(screen.getByText('Det finns fler träffar än vad som kan visas i listan, förfina sökningen.')).toBeInTheDocument()
  })

  it('Should allow user to choose option using click', () => {
    const onSuggestionSelected = vi.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.click(screen.getAllByRole('option')[1])
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[1].label)
  })

  it('Should allow user to choose option using enter key', () => {
    const onSuggestionSelected = vi.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.keyboard('{enter}')
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
  })

  it('Should allow user to choose option using tab', () => {
    const onSuggestionSelected = vi.fn()
    renderComponent({ moreResults: false, suggestions, onSuggestionSelected })
    userEvent.click(screen.getByRole('textbox'))
    expect(onSuggestionSelected).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(onSuggestionSelected).toHaveBeenCalledTimes(1)
    expect(onSuggestionSelected).toHaveBeenNthCalledWith(1, suggestions[0].label)
  })

  it('Should allow user to tab when there are no suggestions', () => {
    renderComponent({ moreResults: false, suggestions: [] })
    userEvent.click(screen.getByRole('textbox'))
    expect(screen.getByRole('textbox')).toHaveFocus()
    userEvent.tab()
    expect(screen.getByRole('textbox')).not.toHaveFocus()
  })

  it('Should allow user to navigate list through hover or arrow keys', () => {
    const onSuggestionSelected = vi.fn()
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
  })

  it('Should closes list on escape key', () => {
    const onClose = vi.fn()
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
    const onChange = vi.fn()
    renderComponent({ moreResults: false, suggestions, onChange })
    expect(onChange).toHaveBeenCalledTimes(0)
    userEvent.type(screen.getByRole('textbox'), 'test')
    expect(onChange).toHaveBeenCalledTimes(4)
  })
})
