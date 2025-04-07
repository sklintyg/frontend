/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import { rest } from 'msw'

export const handlers = [rest.get('/api/prefill', (_, res, ctx) => res(ctx.json({ status: 'loading' })))]
