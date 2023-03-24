import { fakerFromSchema } from '@frontend/fake'
import { Link, linkSchema } from '@frontend/types'
import { screen } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { LayoutFooter } from './LayoutFooter'

it('Should display links', async () => {
  const fakeLink = fakerFromSchema(linkSchema)
  server.use(
    rest.get('/api/config/links', (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json<Record<string, Link>>({
          ineraManualRehabstod: fakeLink({ text: 'ineraManualRehabstod' }),
          ineraNationellKundservice: fakeLink({ text: 'ineraNationellKundservice' }),
          ineraMainPage: fakeLink({ text: 'ineraMainPage' }),
          ineraPersonuppgifter: fakeLink({ text: 'ineraPersonuppgifter' }),
        })
      )
    )
  )

  renderWithRouter(<LayoutFooter />)

  expect(await screen.findByText('ineraManualRehabstod')).toBeInTheDocument()
  expect(await screen.findByText('ineraNationellKundservice')).toBeInTheDocument()
  expect(await screen.findByText('ineraMainPage')).toBeInTheDocument()
  expect(await screen.findByText('ineraPersonuppgifter')).toBeInTheDocument()
})
