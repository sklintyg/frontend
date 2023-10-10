import { createBrowserRouter, createRoutesFromChildren, Navigate, Outlet, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { Certificates } from './pages/Certificates/Certificates'
import { Home } from './pages/Home/Home'
import { Welcome } from './pages/Welcome/Welcome'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" handle={{ crumb: () => 'Start' }} element={<Layout />}>
      <Route index element={<Home />} />

      <Route
        path="/intyg"
        handle={{ crumb: () => 'Intyg' }}
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<Certificates />} />
        <Route
          path=":id"
          handle={{
            crumb: ({ id }: { id: string }) => id,
          }}
          element={<p>Intyget</p>}
        />
      </Route>
    </Route>,
    <Route key="welcome" path="/welcome" element={<Welcome />} />,
    <Route key="start" path="/web/start" element={<Navigate to="/" replace />} />,
  ])
)
