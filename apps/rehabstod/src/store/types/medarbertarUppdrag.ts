export interface MedarbetarUppdrag {
  hsaId: string
  givenName: null | string
  commissionList: CommissionList[]
}

export interface CommissionList {
  healthCareProviderHsaId: null
  healthCareUnitHsaId: string
  commissionPurpose: CommissionPurpose[]
}

export enum CommissionPurpose {
  Admin = 'Admin',
  Inget = 'INGET',
  Statistik = 'STATISTIK',
  VårdOchBehandling = 'Vård och behandling',
}
