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
  FORWARD_QUESTION = 'FORWARD_QUESTION',
  READY_FOR_SIGN = 'READY_FOR_SIGN',
  SIGN_CERTIFICATE = 'SIGN_CERTIFICATE',
  SEND_CERTIFICATE = 'SEND_CERTIFICATE',
  REVOKE_CERTIFICATE = 'REVOKE_CERTIFICATE',
  REPLACE_CERTIFICATE = 'REPLACE_CERTIFICATE',
  REPLACE_CERTIFICATE_CONTINUE = 'REPLACE_CERTIFICATE_CONTINUE',
  PRINT_CERTIFICATE = 'PRINT_CERTIFICATE',
  COPY_CERTIFICATE = 'COPY_CERTIFICATE',
  COPY_CERTIFICATE_CONTINUE = 'COPY_CERTIFICATE_CONTINUE',
  RENEW_CERTIFICATE = 'RENEW_CERTIFICATE',
  CREATE_CERTIFICATE_FROM_TEMPLATE = 'CREATE_CERTIFICATE_FROM_TEMPLATE',
  CREATE_CERTIFICATE_FROM_CANDIDATE = 'CREATE_CERTIFICATE_FROM_CANDIDATE',
  FMB = 'FMB',
  QUESTIONS = 'QUESTIONS',
  QUESTIONS_NOT_AVAILABLE = 'QUESTIONS_NOT_AVAILABLE',
  CREATE_QUESTIONS = 'CREATE_QUESTIONS',
  ANSWER_QUESTION = 'ANSWER_QUESTION',
  HANDLE_QUESTION = 'HANDLE_QUESTION',
  COMPLEMENT_CERTIFICATE = 'COMPLEMENT_CERTIFICATE',
  CANNOT_COMPLEMENT_CERTIFICATE = 'CANNOT_COMPLEMENT_CERTIFICATE',
  ACCESS_SEARCH_CREATE_PAGE = 'ACCESS_SEARCH_CREATE_PAGE',
  ACCESS_DRAFT_LIST = 'ACCESS_DRAFT_LIST',
  ACCESS_UNHANDLED_CERTIFICATES = 'ACCESS_QUESTION_LIST',
  ACCESS_SIGNED_CERTIFICATES_LIST = 'ACCESS_SIGNED_CERTIFICATES_LIST',
  LOG_OUT = 'LOG_OUT',
  CREATE_CERTIFICATE = 'CREATE_CERTIFICATE',
  READ_CERTIFICATE = 'READ_CERTIFICATE',
  CHOOSE_UNIT = 'CHOOSE_UNIT',
  CHANGE_UNIT = 'CHANGE_UNIT',
  PRIVATE_PRACTITIONER_PORTAL = 'PRIVATE_PRACTITIONER_PORTAL',
  NAVIGATE_BACK_BUTTON = 'NAVIGATE_BACK_BUTTON',
  SUBSCRIPTION_WARNING = 'SUBSCRIPTION_WARNING',
  WARNING_NORMAL_ORIGIN = 'WARNING_NORMAL_ORIGIN',
}
