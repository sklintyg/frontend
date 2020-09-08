export interface Certificate {
  id: string;
  status: CertificateStatus;
}

export enum CertificateStatus {
  'UNSIGNED',
  'SIGNED',
  'INVALIDATED',
}
