import { z } from 'zod'
import { CommissionPurposeEnum } from './enums'

export const commissionListSchema = z.object({
  healthCareProviderHsaId: z.string().nullable(),
  healthCareUnitHsaId: z.string(),
  commissionPurpose: z.array(CommissionPurposeEnum),
})

export const medarbetarUppdragSchema = z.object({
  hsaId: z.string(),
  givenName: z.string().nullable(),
  commissionList: z.array(commissionListSchema),
})

export type CommissionList = z.infer<typeof commissionListSchema>
export type MedarbetarUppdrag = z.infer<typeof medarbetarUppdragSchema>
