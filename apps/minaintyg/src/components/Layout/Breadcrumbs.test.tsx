import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { Outlet, Route, RouterProvider, createMemoryRouter, createRoutesFromChildren } from 'react-router-dom'
import { server } from '../../mocks/server'
import { CertificateCrumb } from '../../pages/Certificate/CertificateCrumb'
import { certificateSchema } from '../../schema/certificate.schema'
import { store } from '../../store/store'
import { Breadcrumbs } from './Breadcrumbs'

const renderComponent = (initialEntries = ['/']) =>
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route
              key="root"
              path="/"
              handle={{ crumb: () => 'Start' }}
              element={
                <div>
                  <Breadcrumbs />
                  <Outlet />
                </div>
              }
            >
              <Route index element={<p>Start</p>} />
              <Route path="/intyg" handle={{ crumb: () => 'Intyg' }}>
                <Route index element={<p>Certificates List</p>} />
                <Route
                  path=":id"
                  handle={{
                    crumb: ({ id }: { id: string }) => <CertificateCrumb id={id} />,
                  }}
                  element={<p>Intyget</p>}
                />
              </Route>
            </Route>,
          ]),
          { initialEntries }
        )}
      />
    </Provider>
  )

it('Should render as expected with one level', () => {
  const { baseElement } = renderComponent(['/'])
  expect(baseElement).toMatchSnapshot()
})

it('Should render as expected with two level', () => {
  const { baseElement } = renderComponent(['/intyg'])
  expect(baseElement).toMatchSnapshot()
})

it('Should render as expected with three levels', async () => {
  const certificateName = 'läkares anmälan till transportstyrelsen'
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json(
          fakerFromSchema(certificateSchema)({
            metadata: {
              type: {
                name: certificateName,
              },
            },
          })
        )
      )
    )
  )
  const { baseElement } = renderComponent(['/intyg/12345'])
  expect(await screen.findByText(certificateName)).toBeInTheDocument()
  expect(baseElement).toMatchSnapshot()
})
