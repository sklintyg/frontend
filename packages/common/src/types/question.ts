import { ResourceLink } from './resourceLink'

export interface Question {
  id: string
  type: QuestionType
  subject: string
  message: string
  author: string
  sent: string
  isHandled: boolean
  isForwarded: boolean
  answer?: Answer
  lastUpdate: string
  links: ResourceLink[]
}

export interface Answer {
  id: string
  message: string
  author: string
  sent: string
}

export enum QuestionType {
  MISSING = 'MISSING',
  COORDINATION = 'COORDINATION',
  CONTACT = 'CONTACT',
  OTHER = 'OTHER',
}
