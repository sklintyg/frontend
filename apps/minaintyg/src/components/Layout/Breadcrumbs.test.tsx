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
              key="intyg"
              path="/"
              handle={{ crumb: () => 'Intyg' }}
              element={
                <div>
                  <Breadcrumbs />
                  <Outlet />
                </div>
              }
            >
              <Route index element="Certificates List" />
              <Route
                path=":id"
                handle={{
                  crumb: ({ id }: { id: string }) => <CertificateCrumb id={id} />,
                }}
                element="Intyget"
              />
            </Route>,
            <Route key="no-match" path="/no-matches" element="No available breadcrumbs" />,
          ]),
          { initialEntries }
        )}
      />
    </Provider>
  )

it('Should render as expected with no matches', () => {
  const { container } = renderComponent(['/no-matches'])
  expect(container).toMatchInlineSnapshot(`
    <div>
      No available breadcrumbs
    </div>
  `)
})

it('Should render as expected with one level', () => {
  const { container } = renderComponent(['/'])
  expect(container).toMatchSnapshot()
})

it('Should render as expected with two level', () => {
  const { container } = renderComponent(['/intyg'])
  expect(container).toMatchSnapshot()
})

it('Should contain correct link for start item, mobile and desktop', () => {
  renderComponent(['/'])
  const links = screen.getAllByRole('link', { name: 'Start' })
  expect(links).toHaveLength(2)
  links.forEach((link) => {
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://e-tjanster.1177.se/mvk/')
  })
})

it('Should render as expected with three levels', async () => {
  const certificateName = 'läkares anmälan till transportstyrelsen'
  server.use(
    rest.get('/api/certificate/:id', (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          certificate: fakerFromSchema(certificateSchema)({
            metadata: {
              type: {
                name: certificateName,
              },
            },
          }),
        })
      )
    )
  )
  const { container } = renderComponent(['/12345'])
  expect(await screen.findByText(certificateName)).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})
