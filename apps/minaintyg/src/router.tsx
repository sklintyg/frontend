import { createBrowserRouter, createRoutesFromChildren, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Certificates } from './pages/Certificates/Certificates'
import { Home } from './pages/Home/Home'

export const router = createBrowserRouter(
  createRoutesFromChildren([
    <Route key="root" path="/" handle={{ crumb: () => 'Start' }} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
        <Route index element={<Certificates />} />
        <Route
          path=":id"
          handle={{
            crumb: ({ id }: { id: string }) => id,
          }}
          element={<p>Intyget</p>}
        />
      </Route>
    </Route>,
  ])
)
