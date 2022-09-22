import { ResourceLink, ResourceLinkType } from '@frontend/common'
import faker from 'faker'

export const fakeResourceLink = (data?: Partial<ResourceLink>): ResourceLink => {
  const type = data?.type ?? ResourceLinkType.EDIT_CERTIFICATE
  return {
    type,
    name: faker.lorem.word(),
    description: `${type} - ${faker.lorem.sentence()}`,
    enabled: true,
    ...data,
  }
}
