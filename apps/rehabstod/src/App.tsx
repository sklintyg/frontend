import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { CurrentSickLeavesPatient } from './pages/CurrentSickLeavesPatient/CurrentSickLeavePatient'
import { CurrentSickLeavesTable } from './pages/CurrentSickLeavesTable/CurrentSickLeavesTable'
import { Home } from './pages/Home/Home'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Welcome } from './pages/Welcome/Welcome'

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="/pagaende-sjukfall" element={<CurrentSickLeaves />}>
          <Route index element={<CurrentSickLeavesTable />} />
          <Route path=":patientId" element={<CurrentSickLeavesPatient />} />
        </Route>

        <Route path="/enhet" element={<CareProvider />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
