import faker from 'faker'
import { Question, QuestionType } from '../../types'
import { fakeCertificateRelation } from '../certificate/fakeCertificateRelation'
import { fakeId } from '../fakeId'
import { fakeAnswer } from './fakeAnswer'

export function fakeQuestion(data?: Partial<Question>): Question {
  return {
    id: fakeId(),
    type: QuestionType.COMPLEMENT,
    subject: faker.lorem.sentences(),
    message: faker.lorem.paragraph(),
    author: faker.name.firstName(),
    sent: faker.date.past().toISOString(),
    handled: false,
    forwarded: false,
    answer: fakeAnswer(),
    answeredByCertificate: fakeCertificateRelation(),
    lastUpdate: faker.date.recent().toISOString(),
    lastDateToReply: faker.date.future().toISOString(),
    ...data,
    complements: data?.complements ?? [],
    reminders: data?.reminders ?? [],
    links: data?.links ?? [],
    contactInfo: data?.contactInfo ?? [],
  }
}
