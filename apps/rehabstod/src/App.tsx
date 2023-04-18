import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { Home } from './pages/Home/Home'
import { MedicalOpinion } from './pages/MedicalOpinion/MedicalOpinion'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Patient } from './pages/Patient/Patient'
import { Welcome } from './pages/Welcome/Welcome'

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Layout />}>
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
          <Route path=":patientId" element={<Patient />} />
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
