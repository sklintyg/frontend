import { render } from '@testing-library/react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'
import { SessionEnded } from './SessionEnded'

it('Should render as expected', () => {
  const { container } = render(
    <RouterProvider router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={<SessionEnded />} />))} />
  )
  expect(container).toMatchSnapshot()
})
