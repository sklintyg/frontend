import { createBrowserRouter, createRoutesFromChildren, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/error/ErrorBoundary/ErrorBoundary'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { Home } from './pages/Home/Home'
import { MedicalOpinion } from './pages/MedicalOpinion/MedicalOpinion'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Patient } from './pages/Patient/Patient'
import { Welcome } from './pages/Welcome/Welcome'
import { Error } from './pages/Error/Error'

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
            <MedicalOpinion />
          </ProtectedRoute>
        }
      >
        <Route path=":patientId" element={<Patient />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
      <Route key="error" path="/error" element={<Error />} />
    </Route>,
  ])
)
