import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { NoMatch } from './pages/NoMatch/NoMatch'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
