import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { NoMatch } from './pages/NoMatch/NoMatch'
import { Welcome } from './pages/Welcome/Welcome'
import { CurrentSickLeaves } from './pages/CurrentSickLeaves/CurrentSickLeaves'

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/list/sickleaves" element={<CurrentSickLeaves />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
