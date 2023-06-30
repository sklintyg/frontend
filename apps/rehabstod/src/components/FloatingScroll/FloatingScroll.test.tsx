import { render } from '@testing-library/react'
import { TableFloatingScroll } from './TableFloatingScroll'

it('Should render without issues', () => {
  expect(() => render(<TableFloatingScroll>Hello</TableFloatingScroll>)).not.toThrow()
})

it('Should add handyscroll to element', async () => {
  const { container } = render(<TableFloatingScroll>Hello</TableFloatingScroll>)
  expect(container.querySelector('.handy-scroll')).toBeInTheDocument()
})
