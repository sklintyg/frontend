import { PartialDeep } from 'type-fest'
import { IcfCodeCollection } from '../../types/icf'
import { fakeIcd10Code } from './fakeIcd10Code'
import { fakeIcfCode } from './fakeIcfCode'

export function fakeIcfCodeCollection(value?: PartialDeep<IcfCodeCollection>): IcfCodeCollection {
  return {
    icfCodes: (value?.icfCodes ?? []).map(fakeIcfCode),
    icd10Codes: (value?.icd10Codes ?? []).map(fakeIcd10Code),
  }
}
