import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { CareProvider } from './pages/CareProvider/CareProvider'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'
import { Home } from './pages/Home/Home'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Welcome } from './pages/Welcome/Welcome'

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCKS === 'true') {
  const { worker } = await import('./mocks/browser')
  worker.start()
}

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/pagaende-sjukfall" element={<CurrentSickLeaves />} />
        <Route path="*" element={<NoMatch />} />
        <Route path="/enhet" element={<CareProvider />} />
      </Route>
    </Routes>
  )
}
