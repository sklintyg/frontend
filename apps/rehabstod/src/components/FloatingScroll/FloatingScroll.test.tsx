import { render } from '@testing-library/react'
import { FloatingScroll } from './FloatingScroll'

it('Should render without issues', () => {
  expect(() => render(<FloatingScroll>Hello</FloatingScroll>)).not.toThrow()
})

it('Should add handyscroll to element', async () => {
  const { container } = render(<FloatingScroll>Hello</FloatingScroll>)
  expect(container.querySelector('.handy-scroll')).toBeInTheDocument()
})
