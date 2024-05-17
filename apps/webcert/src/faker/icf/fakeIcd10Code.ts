import faker from 'faker'
import { Icd10Code } from '../../types/icf'
import { fakeId } from '../fakeId'

export function fakeIcd10Code(value?: Partial<Icd10Code>): Icd10Code {
  return {
    code: fakeId(),
    title: faker.lorem.word(),
    ...value,
  }
}
