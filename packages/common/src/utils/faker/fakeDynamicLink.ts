import { DynamicLinkData } from '@frontend/common'
import faker from 'faker'

export const fakeDynamicLink = (data?: Partial<DynamicLinkData>): DynamicLinkData => {
  return {
    key: faker.random.alpha({ count: 5 }),
    url: faker.internet.url(),
    text: faker.lorem.sentence(3),
    target: '_self',
    tooltip: faker.lorem.sentence(8),
    ...data,
  }
}
