import faker from 'faker'
import type { Answer } from '../../types'
import { fakeId } from '../fakeId'

export function fakeAnswer(data?: Partial<Answer>): Answer {
  return {
    id: fakeId(),
    message: faker.lorem.paragraph(),
    author: faker.name.firstName(),
    sent: faker.date.past().toISOString(),
    ...data,
    contactInfo: data?.contactInfo ?? [],
  }
}
