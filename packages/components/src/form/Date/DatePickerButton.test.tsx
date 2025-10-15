import { render } from '@testing-library/react'
import { Popover } from '../../Popover/Popover'
import { DatePickerButton } from './DatePickerButton'

it('should render without errors', () => {
  expect(() =>
    render(
      <Popover>
        <DatePickerButton />
      </Popover>
    )
  ).not.toThrow()
})
