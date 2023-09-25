import { createBrowserRouter, createRoutesFromChildren, Navigate, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { CertificateCrumb } from './pages/Certificate/CertificateCrumb'
import { CertificateListPage } from './pages/Certificate/CertificateListPage'
import { CertificatePage } from './pages/Certificate/CertificatePage'
import { Home } from './pages/Home/Home'
import { Welcome } from './pages/Welcome/Welcome'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" handle={{ crumb: () => 'Start' }} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
        <Route index element={<CertificateListPage />} />
        <Route
          path=":id"
          handle={{
            crumb: ({ id }: { id: string }) => <CertificateCrumb id={id} />,
          }}
          element={<CertificatePage />}
        />
      </Route>
    </Route>,
    <Route key="welcome" path="/welcome" element={<Welcome />} />,
    <Route key="start" path="/web/start" element={<Navigate to="/" replace />} />,
  ])
)
