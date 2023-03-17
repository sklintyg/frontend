import { CertificateType } from '../types/CertificateType'

export function getCertificateInfo(type: string) {
  return (Cypress.env('certificateTypes') as CertificateType[]).find(({ internalType }) => internalType === type)
}
