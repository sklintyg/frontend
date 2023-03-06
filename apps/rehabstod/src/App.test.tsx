import { render } from '@testing-library/react'
import { App } from './App'

it('Should render without error', () => {
  expect(() => render(<App />)).not.toThrowError()
})
