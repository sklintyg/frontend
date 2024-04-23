import faker from 'faker'
import { Reminder } from '../../types'
import { fakeId } from '../fakeId'

export function fakeReminder(data?: Partial<Reminder>): Reminder {
  return {
    id: fakeId(),
    message: faker.lorem.paragraph(),
    author: faker.name.firstName(),
    sent: faker.date.past().toISOString(),
    ...data,
  }
}
