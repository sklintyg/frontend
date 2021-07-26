import { ResourceLink } from './resourceLink'

export interface Question {
  id: string
  type: QuestionType
  subject: string
  message: string
  author: string
  sent: string
  complements: Complement[]
  handled: boolean
  forwarded: boolean
  answer?: Answer
  reminders: Reminder[]
  lastUpdate: string
  links: ResourceLink[]
}

export interface Answer {
  id: string
  message: string
  author: string
  sent: string
}

export interface Reminder {
  id: string
  message: string
  author: string
  sent: string
}

export interface Complement {
  questionId: string
  questionText: string
  valueId: string
  message: string
}

export enum QuestionType {
  MISSING = 'MISSING',
  COORDINATION = 'COORDINATION',
  CONTACT = 'CONTACT',
  OTHER = 'OTHER',
  COMPLEMENT = 'COMPLEMENT',
}
