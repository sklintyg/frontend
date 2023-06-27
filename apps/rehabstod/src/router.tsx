import { createBrowserRouter, createRoutesFromChildren, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/error/ErrorBoundary/ErrorBoundary'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { HsaError } from './pages/Error/components/HsaError'
import { MissingHsaRoleError } from './pages/Error/components/HsaMissingRoleError'
import { LoginFailedError } from './pages/Error/components/LoginFailedError'
import { MissingEmployeeAssignmentError } from './pages/Error/components/MissingEmployeeAssignmentError'
import { UnknownInternalError } from './pages/Error/components/UnknownInternalError'
import { Error } from './pages/Error/Error'
import { Home } from './pages/Home/Home'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Patient } from './pages/Patient/Patient'
import { Welcome } from './pages/Welcome/Welcome'
import { LUCertificates } from './pages/LUCertificates/LUCertificates'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="welcome" path="/welcome" element={<Welcome />} />,
    <Route key="root" path="/" element={<Layout />}>
      <Route index errorElement={<ErrorBoundary />} element={<Home />} />
      <Route
        path="/enhet"
        errorElement={<ErrorBoundary />}
        element={
          <ProtectedRoute>
            <CareProvider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pagaende-sjukfall"
        errorElement={<ErrorBoundary />}
        element={
          <ProtectedRoute requireUnit>
            <CurrentSickLeaves />
          </ProtectedRoute>
        }
      >
        <Route path=":encryptedPatientId" element={<Patient />} />
      </Route>
      <Route
        path="/lakarutlatanden"
        errorElement={<ErrorBoundary />}
        element={
          <ProtectedRoute requireUnit>
            <LUCertificates />
          </ProtectedRoute>
        }
      >
        <Route path=":patientId" element={<Patient />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
      <Route path="/error" element={<Error />}>
        <Route index element={<UnknownInternalError />} />
        <Route path="login-hsaerror" element={<HsaError />} />
        <Route path="login-saknar-hsa-rehabroll" element={<MissingHsaRoleError />} />
        <Route path="login-failed" element={<LoginFailedError />} />
        <Route path="login-medarbetaruppdrag" element={<MissingEmployeeAssignmentError />} />
        <Route path="*" element={<UnknownInternalError />} />
      </Route>
    </Route>,
  ])
)
