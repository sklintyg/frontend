import { Navigate, Outlet, Route, ScrollRestoration, createRoutesFromChildren } from 'react-router-dom'
import { Breadcrumbs } from './components/Layout/Breadcrumbs'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import { CertificateListPage } from './pages/Certificate/CertificateListPage'
import { CertificatePage } from './pages/Certificate/CertificatePage'
import { SendCertificatePage } from './pages/Certificate/SendCertificatePage'
import { ErrorPage } from './pages/Error/ErrorPage'
import { LogoutPage } from './pages/Logout/LogoutPage'
import { Welcome } from './pages/Welcome/Welcome'

export const routes = createRoutesFromChildren([
  <Route
    key="root"
    path="/intyg"
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
    <Route path="/intyg" handle={{ crumb: () => 'Intyg' }} errorElement={<ErrorBoundary />}>
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
  <Route
    key="logout"
    path="/logga-ut"
    element={
      <Layout>
        <LogoutPage />
      </Layout>
    }
  />,
  <Route
    key="error"
    path="/error/:type"
    element={
      <Layout>
        <Outlet />
      </Layout>
    }
  >
    <Route index element={<ErrorPage />} />
    <Route path=":id" element={<ErrorPage />} />
  </Route>,
  <Route key="welcome" path="/welcome" element={<Welcome />} />,
  <Route key="start" path="/web/start" element={<Navigate to="/" replace />} />,
])
