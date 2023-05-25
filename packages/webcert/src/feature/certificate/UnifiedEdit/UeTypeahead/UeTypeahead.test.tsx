import { fakeTypeaheadElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import UeTypeahead from './UeTypeahead'

const question = fakeTypeaheadElement({ id: '1' })['1']

const mockDispatchFn = vi.fn()

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
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useSelectorSpy.mockReturnValue({})
  useDispatchSpy.mockReturnValue(mockDispatchFn)
})

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

  it.skip('dispatches results when users types text', async () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Ö')
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })

  it.skip('dispatches results when users types new text only after a wait', async () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Ö')
    await userEvent.type(input, 's')
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
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
