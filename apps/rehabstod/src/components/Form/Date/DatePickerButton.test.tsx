import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import { DatePickerButton } from './DatePickerButton'
import { Popover } from '../../Popover/Popover'

it('should render without errors', () => {
  expect(() =>
    render(
      <Popover>
        <DatePickerButton />
      </Popover>
    )
  ).not.toThrow()
})
