import { rest } from 'msw'
import { server } from './server'

it('Should responde to requests', async () => {
  const expected = { foo: 'bar' }
  server.use(rest.get('http://localhost/test', async (_, res, ctx) => res(ctx.status(200), ctx.json(expected))))

  const response = await fetch('http://localhost/test')
  const data = await response.json()
  expect(data).toEqual(expected)
})

it('Should return user data', async () => {
  const response = await fetch('http://localhost/api/user')
  const data = await response.json()
  expect(data).toEqual({})
})
