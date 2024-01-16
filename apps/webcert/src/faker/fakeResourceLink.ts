import faker from 'faker'
import { ResourceLink, ResourceLinkType } from '../types/resourceLink'

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
