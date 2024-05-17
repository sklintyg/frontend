import { PartialDeep } from 'type-fest'
import { IcfCollection } from '../../types/icf'
import { fakeIcfCodeCollection } from './fakeIcfCodeCollection'

export function fakeIcfCollection(value?: PartialDeep<IcfCollection>): IcfCollection {
  return {
    commonCodes: fakeIcfCodeCollection(value?.commonCodes),
    uniqueCodes: (value?.uniqueCodes ?? []).map(fakeIcfCodeCollection),
  }
}
