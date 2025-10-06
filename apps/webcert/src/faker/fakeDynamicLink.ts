import faker from 'faker'
import type { DynamicLinkData } from '../types/utils'
import { fakeId } from './fakeId'

const fakeDynamicLink = (data?: Partial<DynamicLinkData>): DynamicLinkData => {
  return {
    key: fakeId(),
    url: faker.internet.url(),
    text: faker.lorem.sentence(3),
    target: '_self',
    tooltip: faker.lorem.sentence(8),
    ...data,
  }
}
