import { fakeTypeaheadElement } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithStore } from '../../../../utils/renderWithStore'
import UeTypeahead from './UeTypeahead'

const question = fakeTypeaheadElement({ id: '1' })['1']

const renderDefaultComponent = () => {
  return renderWithStore(<UeTypeahead question={question} disabled={false} />)
}

const renderWithSuggestions = () => {
  renderWithStore(<UeTypeahead question={question} disabled={true} />)
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

  it('disables component if disabled is set', () => {
    renderWithSuggestions()
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('shows results when users types text', async () => {
    renderDefaultComponent()
    const testinput = 'Ö'
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    await userEvent.type(input, testinput)
    expect(screen.queryAllByRole('option')).toHaveLength(60)
    expect(input).toHaveValue(testinput)
    expect(screen.queryAllByRole('option')).toHaveLength(60)
  })

  it('Render correct suggestions', async () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'ors')
    const listItems = screen.queryAllByRole('option')
    expect(listItems[0].title).toBe('ORSA')
    expect(listItems[1].title).toBe('BENGTSFORS')
    expect(listItems[2].title).toBe('DEGERFORS')
    expect(listItems[3].title).toBe('FORSHAGA')
    expect(listItems[4].title).toBe('HAGFORS')
  })
})
