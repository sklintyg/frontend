import faker from 'faker'
import type { Question } from '../../types'
import { QuestionType } from '../../types'
import { fakeId } from '../fakeId'

export function fakeQuestion(data?: Partial<Question>): Question {
  return {
    id: fakeId(),
    type: QuestionType.COMPLEMENT,
    subject: faker.lorem.words(),
    message: faker.lorem.paragraph(),
    author: faker.name.firstName(),
    sent: faker.date.past().toISOString(),
    handled: false,
    forwarded: false,
    answer: undefined,
    answeredByCertificate: undefined,
    lastUpdate: faker.date.recent().toISOString(),
    lastDateToReply: undefined,
    ...data,
    complements: data?.complements ?? [],
    reminders: data?.reminders ?? [],
    links: data?.links ?? [],
    contactInfo: data?.contactInfo ?? [],
    certificateId: fakeId(),
  }
}
