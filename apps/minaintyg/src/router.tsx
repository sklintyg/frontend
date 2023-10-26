import { createBrowserRouter, createRoutesFromChildren, Navigate, Route, ScrollRestoration } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CertificateCrumb } from './pages/Certificate/CertificateCrumb'
import { CertificateListPage } from './pages/Certificate/CertificateListPage'
import { CertificatePage } from './pages/Certificate/CertificatePage'
import { SendCertificatePage } from './pages/Certificate/SendCertificatePage'
import { LogoutPage } from './pages/Logout/LogoutPage'
import { Welcome } from './pages/Welcome/Welcome'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route
      key="root"
      path="/"
      handle={{ crumb: () => 'Start' }}
      element={
        <ProtectedRoute>
          <Layout />
          <ScrollRestoration />
        </ProtectedRoute>
      }
    >
      <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
        <Route index element={<CertificateListPage />} />
        <Route
          path=":id"
          handle={{
            crumb: ({ id }: { id: string }) => <CertificateCrumb id={id} />,
          }}
        >
          <Route index element={<CertificatePage />} />
          <Route path="skicka" handle={{ crumb: () => 'Skicka intyg' }} element={<SendCertificatePage />} />
        </Route>
      </Route>
    </Route>,
    <Route key="welcome" path="/welcome" element={<Welcome />} />,
    <Route key="logout" path="/logout" element={<LogoutPage />} />,
    <Route key="start" path="/web/start" element={<Navigate to="/" replace />} />,
  ])
)
