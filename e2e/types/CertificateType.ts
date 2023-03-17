export interface CertificateType {
  type: string
  internalType: string
  name: string
  versions: string[]
  statuses: Status[]
  fillType: FillType[]
}

export enum FillType {
  Empty = 'EMPTY',
  Maximal = 'MAXIMAL',
  Minimal = 'MINIMAL',
}

export enum Status {
  Locked = 'LOCKED',
  Signed = 'SIGNED',
  Unsigned = 'UNSIGNED',
}
