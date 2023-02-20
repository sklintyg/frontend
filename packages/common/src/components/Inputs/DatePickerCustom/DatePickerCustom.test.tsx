import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it } from 'vitest'
import DatePickerCustom from './DatePickerCustom'

describe('DatePickerCustom', () => {
  it('Should disable options past max date', async () => {
    render(
      <DatePickerCustom
        setDate={jest.fn()}
        inputString={'1974-04-01'}
        textInputOnChange={jest.fn()}
        displayValidationErrorOutline={false}
        max={'1974-04-06'}
      />
    )

    await act(async () => {
      userEvent.click(screen.getByAltText('Kalender'))
    })

    expect(screen.getAllByLabelText(/Not available .* 1974/)).toHaveLength(29)
  })
})
