import { createBrowserRouter, createRoutesFromChildren, Navigate, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Certificates } from './pages/Certificates/Certificates'
import { Home } from './pages/Home/Home'
import { Welcome } from './pages/Welcome/Welcome'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" handle={{ crumb: () => 'Start' }} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
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
