import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DatePickerCustom from './DatePickerCustom'

describe('DatePickerCustom', () => {
  it('Should disable options past max date', async () => {
    render(
      <DatePickerCustom
        setDate={vi.fn()}
        inputString={'1974-04-01'}
        textInputOnChange={vi.fn()}
        displayValidationErrorOutline={false}
        max={'1974-04-06'}
      />
    )

    await act(() => userEvent.click(screen.getByAltText('Kalender')))

    expect(screen.getAllByLabelText(/Not available .* 1974/)).toHaveLength(29)
  })
})
