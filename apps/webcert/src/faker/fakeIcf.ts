import faker from 'faker'
import { PartialDeep } from 'type-fest'
import { Icd10Code, IcfCode } from '../types/icf'

const fakeCode = (value?: Partial<IcfCode>): IcfCode => ({
  code: faker.random.alpha({ count: 5 }),
  description: faker.lorem.sentence(2),
  includes: faker.lorem.sentence(),
  title: faker.lorem.word(),
  ...value,
})

const fakeIcd10Code = (value?: Partial<Icd10Code>): Icd10Code => ({
  code: faker.random.alpha({ count: 5 }),
  title: faker.lorem.word(),
  ...value,
})

interface IcfGroup {
  icfCodes: IcfCode[]
  icd10Codes: Icd10Code[]
}

const fakeIcfGroup = (value?: PartialDeep<IcfGroup>): IcfGroup => ({
  icfCodes: (value?.icfCodes ?? []).map(fakeCode),
  icd10Codes: (value?.icd10Codes ?? []).map(fakeIcd10Code),
})

interface IcfCollection {
  commonCodes: IcfGroup
  uniqueCodes: IcfGroup[]
}

const fakeIcfCollection = (value?: PartialDeep<IcfCollection>): IcfCollection => ({
  commonCodes: fakeIcfGroup(value?.commonCodes),
  uniqueCodes: (value?.uniqueCodes ?? []).map(fakeIcfGroup),
})

export const fakeIcf = {
  code: fakeCode,
  icd10Code: fakeIcd10Code,
  group: fakeIcfGroup,
  collection: fakeIcfCollection,
}
