export type CertificateModalActionType = 'DELETE' | 'READ' | 'CANCEL'

export interface CertificateConfirmationModal {
  title: string
  text: string
  alert?: string
  checkboxText: string
  primaryAction: CertificateModalActionType
  secondaryAction: CertificateModalActionType
}
