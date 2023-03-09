import { render } from '@testing-library/react'
import { NoMatch } from './NoMatch'

it('Should render without error', () => {
  expect(() => render(<NoMatch />)).not.toThrow()
})
