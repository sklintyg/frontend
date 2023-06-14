import { render } from '@testing-library/react'
import { Calendar } from './Calendar'

it('Should render without crashing', () => {
  expect(() => render(<Calendar />)).not.toThrow()
})
