import { faker } from '@faker-js/faker'
import { setupWorker } from 'msw'
import { handlers } from './handlers'

faker.setLocale('sv')
faker.seed(1234)

export const worker = setupWorker(...handlers)
