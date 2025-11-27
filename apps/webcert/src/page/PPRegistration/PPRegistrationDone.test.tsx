import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PPRegistrationDone } from './PPRegistrationDone'

it('should render without issues', () => {
  expect(() =>
    render(
      <MemoryRouter initialEntries={['/done']}>
        <Routes>
          <Route path="/done" element={<PPRegistrationDone />} />
          <Route path="/" element="Start" />
        </Routes>
      </MemoryRouter>
    )
  ).not.toThrow()
})
