import faker from 'faker'
import { IcfCode } from '../../types/icf'
import { fakeId } from '../fakeId'

export function fakeIcfCode(value?: Partial<IcfCode>): IcfCode {
  return {
    code: fakeId(),
    description: faker.lorem.sentence(2),
    includes: faker.lorem.sentence(),
    title: faker.lorem.word(),
    ...value,
  }
}
