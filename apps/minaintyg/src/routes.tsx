import { Navigate, Outlet, Route, ScrollRestoration, createRoutesFromChildren } from 'react-router-dom'
import { Breadcrumbs } from './components/Layout/Breadcrumbs'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CertificateListPage } from './pages/Certificate/CertificateListPage'
import { CertificatePage } from './pages/Certificate/CertificatePage'
import { SendCertificatePage } from './pages/Certificate/SendCertificatePage'
import { LogoutPage } from './pages/Logout/LogoutPage'
import { Welcome } from './pages/Welcome/Welcome'

export const routes = createRoutesFromChildren([
  <Route
    key="root"
    path="/"
    handle={{ crumb: () => 'Start' }}
    element={
      <ProtectedRoute>
        <Layout>
          <Breadcrumbs />
          <div className="max-w-screen-lg">
            <Outlet />
          </div>
        </Layout>
        <ScrollRestoration />
      </ProtectedRoute>
    }
  >
    <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
      <Route index element={<CertificateListPage />} />
      <Route
        path=":id"
        handle={{
          crumb: () => 'Läs och hantera ditt intyg',
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
