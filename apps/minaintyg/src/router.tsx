import { createBrowserRouter, createRoutesFromChildren, Navigate, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { Welcome } from './pages/Welcome/Welcome'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>,
    <Route key="welcome" path="/welcome" element={<Welcome />} />,
    <Route key="start" path="/web/start" element={<Navigate to="/" replace />} />,
  ])
)
