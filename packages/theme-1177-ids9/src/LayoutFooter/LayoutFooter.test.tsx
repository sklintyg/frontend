import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LayoutFooter } from './LayoutFooter'

it('Should not have Webbkarta link when session is available', () => {
  render(
    <MemoryRouter>
      <LayoutFooter hasSession={false} />
    </MemoryRouter>
  )
  expect(screen.queryAllByRole('link', { name: 'Webbkarta' })).toHaveLength(0)
})

it('Should have Webbkarta link when session is available', () => {
  render(
    <MemoryRouter>
      <LayoutFooter hasSession />
    </MemoryRouter>
  )
  expect(screen.queryAllByRole('link', { name: 'Webbkarta' })).toHaveLength(2)
})
