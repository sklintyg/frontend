import { ReactNode } from 'react'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom'

export const withRouter = (element: ReactNode) => (
  <RouterProvider router={createMemoryRouter(createRoutesFromElements(<Route path="/" element={element} />))} />
)
