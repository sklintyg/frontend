import { z } from 'zod'
import { CommissionPurposeEnum } from './enums'

const commissionListSchema = z.object({
  healthCareProviderHsaId: z.string().nullable(),
  healthCareUnitHsaId: z.string(),
  commissionPurpose: z.array(CommissionPurposeEnum),
})

export const medarbetarUppdragSchema = z.object({
  hsaId: z.string(),
  givenName: z.string().nullable(),
  commissionList: z.array(commissionListSchema),
})

type CommissionList = z.infer<typeof commissionListSchema>
export type MedarbetarUppdrag = z.infer<typeof medarbetarUppdragSchema>
