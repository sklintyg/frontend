import { waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../../mocks/server'
import { certificateApi } from '../certificateApi'
import store from '../store'
import { ErrorCode } from './errorReducer'

describe('handle get certificate error', () => {
  it('should handle get certificate errors', async () => {
    server.use(
      rest.get('/api/certificate/:id', (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            error: {
              errorCode: ErrorCode.AUTHORIZATION_PROBLEM,
              message: 'Something gone wrong',
            },
            certificateId: '123',
          })
        )
      )
    )

    store.dispatch(certificateApi.endpoints.getCertificate.initiate('123'))

    await waitFor(() =>
      expect(store.getState().ui.uiError.error).toMatchObject({
        errorCode: ErrorCode.AUTHORIZATION_PROBLEM,
        message: 'Something gone wrong',
      })
    )
  })

  it('should fall back to GET_CERTIFICATE_PROBLEM when errorCode is missing', async () => {
    server.use(
      rest.get('/api/certificate/:id', (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            error: {
              message: 'Something gone wrong',
            },
            certificateId: '123',
          })
        )
      )
    )

    store.dispatch(certificateApi.endpoints.getCertificate.initiate('123'))

    await waitFor(() =>
      expect(store.getState().ui.uiError.error).toMatchObject({
        errorCode: ErrorCode.GET_CERTIFICATE_PROBLEM,
        message: 'Something gone wrong',
      })
    )
  })
})
