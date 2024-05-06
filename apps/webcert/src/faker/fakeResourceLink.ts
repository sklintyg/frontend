import faker from 'faker'
import { ResourceLink, ResourceLinkType } from '../types/resourceLink'

function fakeResourceLinkName(type: ResourceLinkType) {
  switch (type) {
    case ResourceLinkType.NAVIGATE_BACK_BUTTON:
      return 'Tillbaka'
    case ResourceLinkType.SUBSCRIPTION_WARNING:
      return 'Saknar avtal'
    case ResourceLinkType.PRIVATE_PRACTITIONER_PORTAL:
      return 'Min sida'
    case ResourceLinkType.CHANGE_UNIT:
      return 'Byt vårdenhet'
    case ResourceLinkType.CHOOSE_UNIT:
      return 'Välj vårdenhet'
    case ResourceLinkType.FORWARD_QUESTION:
      return 'Vidarebefordra'
    case ResourceLinkType.QUESTIONS_NOT_AVAILABLE:
      return 'Ärendekommunikation'
    case ResourceLinkType.CREATE_QUESTIONS:
      return 'Ny fråga'
  }
}

export const fakeResourceLink = (data?: Partial<ResourceLink>): ResourceLink => {
  const type = data?.type ?? ResourceLinkType.EDIT_CERTIFICATE
  return {
    type,
    name: fakeResourceLinkName(type) ?? faker.lorem.word(10),
    description: `${type} - ${faker.lorem.sentence()}`,
    enabled: true,
    ...data,
  }
}
