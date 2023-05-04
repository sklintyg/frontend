/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@frontend/fake'
import { setupWorker } from 'msw'
import { handlers } from './handlers'

faker.setLocale('sv')
faker.seed(1234)

export const worker = setupWorker(...handlers)
