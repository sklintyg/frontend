import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { server } from '../../mocks/server'
import { userSchema } from '../../schema/user.schema'
import { store } from '../../store/store'
import { Home } from './Home'

it('Should have text', async () => {
  server.use(
    rest.get('/api/certificates/user', (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakerFromSchema(userSchema)({ fullName: 'Anton Antonsson' })))
    )
  )
  render(
    <Provider store={store}>
      <Home />
    </Provider>
  )
  expect(await screen.findByText('Inloggad som: Anton Antonsson')).toBeInTheDocument()
})
