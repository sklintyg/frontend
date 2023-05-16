import { Route, Routes, useRouteError } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { Home } from './pages/Home/Home'
import { MedicalOpinion } from './pages/MedicalOpinion/MedicalOpinion'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Patient } from './pages/Patient/Patient'
import { Welcome } from './pages/Welcome/Welcome'

function ErrorBoundary() {
  const error = useRouteError()
  // eslint-disable-next-line no-console
  console.error(error)
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>
}

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} errorElement={<ErrorBoundary />} />
      <Route path="/" element={<Layout />} errorElement={<ErrorBoundary />}>
        <Route index element={<Home />} />
        <Route
          path="/enhet"
          element={
            <ProtectedRoute>
              <CareProvider />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagaende-sjukfall"
          element={
            <ProtectedRoute requireUnit>
              <CurrentSickLeaves />
            </ProtectedRoute>
          }>
          <Route path=":encryptedPatientId" element={<Patient />} />
        </Route>
        <Route
          path="/lakarutlatanden"
          element={
            <ProtectedRoute requireUnit>
              <MedicalOpinion />
            </ProtectedRoute>
          }>
          <Route path=":patientId" element={<Patient />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
