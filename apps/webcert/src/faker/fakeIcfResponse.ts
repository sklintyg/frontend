import { IcfResponse } from '../store/icf/icfActions'
import { fakeIcf } from './fakeIcf'

export function fakeIcfResponse(data?: Partial<IcfResponse>): IcfResponse {
  const icfCodes = Array.from({ length: 3 }, fakeIcf.code)

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes, icd10Codes: icdCodes },
      uniqueCodes: [
        { icfCodes, icd10Codes: [ICD_CODE_1] },
        { icfCodes, icd10Codes: [ICD_CODE_2] },
      ],
      ...data?.activityLimitation,
    },
    disability: {
      commonCodes: { icfCodes, icd10Codes: icdCodes },
      uniqueCodes: [
        { icfCodes, icd10Codes: [ICD_CODE_1] },
        { icfCodes, icd10Codes: [ICD_CODE_2] },
      ],
      ...data?.disability,
    },
  }
}
