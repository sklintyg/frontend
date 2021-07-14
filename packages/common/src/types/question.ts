export interface Question {
  id: string
  type: QuestionType
  subject: string
  message: string
  author: string
  sent: string
  isHandled: boolean
  isForwarded: boolean
  lastUpdate: string
}

export enum QuestionType {
  DEFAULT = '',
  COORDINATION = 'COORDINATION',
  CONTACT = 'CONTACT',
  OTHER = 'OTHER',
}
