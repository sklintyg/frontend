import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useResolvedPath } from 'react-router-dom'
import { expect, it } from 'vitest'
import { useActivePage } from './useActivePage'

function TestComponent({ to }: { to: string }) {
  const isActive = useActivePage(to)
  const path = useResolvedPath(to)
  const location = useLocation()
  return (
    <div>
      <p data-testid="resolved">{path.pathname}</p>
      <p data-testid="current">{location.pathname}</p>
      <p data-testid="needle">{to}</p>
      <p data-testid="active">{isActive.toString()}</p>
    </div>
  )
}

it('Should return true when location is same as path', () => {
  render(
    <MemoryRouter initialEntries={['/some-location']}>
      <Routes>
        <Route path="/*" element={<TestComponent to="/some-location" />} />
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByTestId('resolved')).toHaveTextContent('/some-location')
  expect(screen.getByTestId('current')).toHaveTextContent('/some-location')
  expect(screen.getByTestId('needle')).toHaveTextContent('/some-location')
  expect(screen.getByTestId('active')).toHaveTextContent('true')
})

it('Should return true when location starts with path', () => {
  render(
    <MemoryRouter initialEntries={['/first/second']}>
      <Routes>
        <Route path="/*" element={<TestComponent to="/first" />} />
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByTestId('resolved')).toHaveTextContent('/first')
  expect(screen.getByTestId('current')).toHaveTextContent('/first/second')
  expect(screen.getByTestId('needle')).toHaveTextContent('/first')
  expect(screen.getByTestId('active')).toHaveTextContent('true')
})

it('Should return false when location is different', () => {
  render(
    <MemoryRouter initialEntries={['/first/second']}>
      <Routes>
        <Route path="/*" element={<TestComponent to="/third" />} />
      </Routes>
    </MemoryRouter>
  )
  expect(screen.getByTestId('resolved')).toHaveTextContent('/third')
  expect(screen.getByTestId('current')).toHaveTextContent('/first/second')
  expect(screen.getByTestId('needle')).toHaveTextContent('/third')
  expect(screen.getByTestId('active')).toHaveTextContent('false')
})
