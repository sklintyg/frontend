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

const checkListVisibility = (visible: boolean) => {
  const listItems = screen.queryAllByRole('option')
  if (visible) {
    expect(listItems).toHaveLength(60)
  } else {
    expect(listItems).toHaveLength(0)
  }
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

  it.skip('dispatches results when users types text', () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'Ö')
    setTimeout(() => {
      expect(mockDispatchFn).toHaveBeenCalledTimes(1)
    }, 30)
  })

  it.skip('dispatches results when users types new text only after a wait', () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'Ö')
    setTimeout(() => {
      userEvent.type(input, 's')
      setTimeout(() => {
        expect(mockDispatchFn).toHaveBeenCalledTimes(0)
      }, 30)
    }, 30)
    setTimeout(() => {
      expect(mockDispatchFn).toHaveBeenCalledTimes(1)
    }, 500)
  })

  it('does not dispatch results when users text is not changed, even after wait', () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'Ö')
    setTimeout(() => {
      userEvent.clear(input)
      setTimeout(() => {
        userEvent.type(input, 'Ö')
        expect(mockDispatchFn).toHaveBeenCalledTimes(0)
        setTimeout(() => {
          expect(mockDispatchFn).toHaveBeenCalledTimes(0)
        }, 500)
      }, 30)
    }, 30)
  })

  it('Render correct suggestions', () => {
    renderDefaultComponent()
    const input = screen.getByRole('textbox')
    userEvent.clear(input)
    userEvent.type(input, 'ors')
    const listItems = screen.queryAllByRole('option')
    expect(listItems[0].title).toBe('ORSA')
    expect(listItems[1].title).toBe('BENGTSFORS')
    expect(listItems[2].title).toBe('DEGERFORS')
    expect(listItems[3].title).toBe('FORSHAGA')
    expect(listItems[4].title).toBe('HAGFORS')
  })
})
