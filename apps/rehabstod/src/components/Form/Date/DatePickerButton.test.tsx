import { render } from '@testing-library/react'
import { DatePickerButton } from './DatePickerButton'

it('should render without errors', () => {
  expect(() => render(<DatePickerButton />)).not.toThrow()
})
