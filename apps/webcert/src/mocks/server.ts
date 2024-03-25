/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
