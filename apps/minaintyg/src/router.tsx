import { createBrowserRouter, createRoutesFromChildren, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>,
  ])
)
