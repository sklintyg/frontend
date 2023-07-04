import { render } from '@testing-library/react'
import { Table } from '../Table'
import { FloatingTableScroll } from './FloatingTableScroll'

it('Should render without issues', () => {
  expect(() =>
    render(
      <Table>
        <FloatingTableScroll>Hello</FloatingTableScroll>
      </Table>
    )
  ).not.toThrow()
})

it('Should add handyscroll to element', async () => {
  const { container } = render(
    <Table>
      <FloatingTableScroll>Hello</FloatingTableScroll>
    </Table>
  )
  expect(container.querySelector('.handy-scroll')).toBeInTheDocument()
})
