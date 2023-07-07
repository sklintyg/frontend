import { render } from '@testing-library/react'
import { FloatingTableScroll } from './FloatingTableScroll'

it('Should render without issues', () => {
  expect(() => render(<FloatingTableScroll>Hello</FloatingTableScroll>)).not.toThrow()
})

it('Should add handyscroll to element', async () => {
  const { container } = render(<FloatingTableScroll>Hello</FloatingTableScroll>)
  expect(container.querySelector('.handy-scroll')).toBeInTheDocument()
})
