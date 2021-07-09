export interface ResourceLink {
  type: ResourceLinkType
  name: string
  description: string
  body?: string
  enabled: boolean
}

export enum ResourceLinkType {
  EDIT_CERTIFICATE = 'EDIT_CERTIFICATE',
  REMOVE_CERTIFICATE = 'REMOVE_CERTIFICATE',
  FORWARD_CERTIFICATE = 'FORWARD_CERTIFICATE',
  SIGN_CERTIFICATE = 'SIGN_CERTIFICATE',
  SEND_CERTIFICATE = 'SEND_CERTIFICATE',
  REVOKE_CERTIFICATE = 'REVOKE_CERTIFICATE',
  REPLACE_CERTIFICATE = 'REPLACE_CERTIFICATE',
  REPLACE_CERTIFICATE_CONTINUE = 'REPLACE_CERTIFICATE_CONTINUE',
  PRINT_CERTIFICATE = 'PRINT_CERTIFICATE',
  COPY_CERTIFICATE = 'COPY_CERTIFICATE',
  RENEW_CERTIFICATE = 'RENEW_CERTIFICATE',
  FMB = 'FMB',
  QUESTIONS = 'QUESTIONS',
  QUESTIONS_NOT_AVAILABLE = 'QUESTIONS_NOT_AVAILABLE',
}
