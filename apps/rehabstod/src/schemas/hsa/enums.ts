import { z } from 'zod'

export enum AllowedInApplication {
  IB = 'IB',
  RS = 'RS',
  WC = 'WC',
}

export enum HealthCareProfessionalLicence {
  Läkare = 'Läkare',
  Tandläkare = 'Tandläkare',
}

export enum Env {
  demo = 'demo',
  dev = 'dev',
}

export enum CommissionPurpose {
  Admin = 'Admin',
  INGET = 'INGET',
  STATISTIK = 'STATISTIK',
  VardOchBehandling = 'Vård och behandling',
}

export const HealthCareProfessionalLicenceEnum = z.nativeEnum(HealthCareProfessionalLicence)
export const AllowedInApplicationEnum = z.nativeEnum(AllowedInApplication)
export const EnvEnum = z.nativeEnum(Env)
export const CommissionPurposeEnum = z.nativeEnum(CommissionPurpose)
