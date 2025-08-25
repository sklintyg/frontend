export type CertificateModalActionType = 'DELETE' | 'READ' | 'CANCEL' | 'SIGN'
export type AlertType = 'INFO' | 'ERROR' | 'OBSERVE'

export interface CertificateConfirmationModal {
  title: string
  text: string
  alert?: Alert
  checkboxText: string
  primaryAction: CertificateModalActionType
  secondaryAction: CertificateModalActionType
}

export interface Alert {
  type: AlertType
  text: string
}
