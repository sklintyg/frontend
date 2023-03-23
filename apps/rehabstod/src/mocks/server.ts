/* eslint-disable import/no-extraneous-dependencies */
import { setupServer } from 'msw/node'
import { handlers } from './handlers/handlers'

export const server = setupServer(...handlers)
