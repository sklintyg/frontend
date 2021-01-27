export interface ResourceLink {
  type: ResourceLinkType
  name: string
  description: string
  enabled: boolean
}

export interface ResourceLinkSend extends ResourceLink {
  modalBody: string
  receiver: string
}

export enum ResourceLinkType {
  EDIT_CERTIFICATE = 'EDIT_CERTIFICATE',
  REMOVE_CERTIFICATE = 'REMOVE_CERTIFICATE',
  FORWARD_CERTIFICATE = 'FORWARD_CERTIFICATE',
  SIGN_CERTIFICATE = 'SIGN_CERTIFICATE',
  SEND_CERTIFICATE = 'SEND_CERTIFICATE',
  REVOKE_CERTIFICATE = 'REVOKE_CERTIFICATE',
  REPLACE_CERTIFICATE = 'REPLACE_CERTIFICATE',
  PRINT_CERTIFICATE = 'PRINT_CERTIFICATE',
  COPY_CERTIFICATE = 'COPY_CERTIFICATE',
  FMB = 'FMB',
}
