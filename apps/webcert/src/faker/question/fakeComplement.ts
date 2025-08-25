import faker from 'faker'
import type { Complement } from '../../types'
import { fakeId } from '../fakeId'

export function fakeComplement(data?: Partial<Complement>): Complement {
  return {
    questionId: fakeId(),
    questionText: faker.lorem.sentences(),
    valueId: fakeId(),
    message: faker.lorem.paragraph(),
    ...data,
  }
}
