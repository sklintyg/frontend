import { CertificateRelation } from './certificate'
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
  answeredByCertificate?: CertificateRelation
  reminders: Reminder[]
  lastUpdate: string
  links: ResourceLink[]
  lastDateToReply?: string
  contactInfo?: string[]
  certificateId: string
}

export interface Answer {
  id: string
  message: string
  author: string
  sent: string
  contactInfo?: string[]
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

export enum CannotComplementOption {
  NO_FURTHER_MED_INFO = 'NO_FURTHER_MED_INFO',
  NO_RESP_MEDICAL_CONTENT = 'NO_RESP_MEDICAL_CONTENT',
}
