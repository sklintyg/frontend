import { z } from 'zod'

export enum AllowedInApplication {
  RS = 'RS',
}

enum HealthCareProfessionalLicence {
  Läkare = 'Läkare',
  Tandläkare = 'Tandläkare',
}

enum Env {
  demo = 'demo',
  dev = 'dev',
}

enum CommissionPurpose {
  Admin = 'Admin',
  INGET = 'INGET',
  STATISTIK = 'STATISTIK',
  VardOchBehandling = 'Vård och behandling',
}

export const HealthCareProfessionalLicenceEnum = z.nativeEnum(HealthCareProfessionalLicence)
export const AllowedInApplicationEnum = z.nativeEnum(AllowedInApplication)
export const EnvEnum = z.nativeEnum(Env)
export const CommissionPurposeEnum = z.nativeEnum(CommissionPurpose)
