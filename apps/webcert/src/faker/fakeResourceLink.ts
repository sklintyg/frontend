import faker from 'faker'
import { ResourceLink, ResourceLinkType } from '../types/resourceLink'

function fakeResourceLinkName(type: ResourceLinkType) {
  switch (type) {
    case ResourceLinkType.PRINT_CERTIFICATE:
      return 'Skriv ut'
    case ResourceLinkType.REPLACE_CERTIFICATE:
      return 'Ersätt'
    case ResourceLinkType.RENEW_CERTIFICATE:
      return 'Förnya'
    case ResourceLinkType.REVOKE_CERTIFICATE:
      return 'Makulera'
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
    case ResourceLinkType.QUESTIONS:
      return 'Ärendekommunikation'
    case ResourceLinkType.CREATE_QUESTIONS:
      return 'Ny fråga'
    default:
      return faker.lorem.word(10)
  }
}

function fakeResourceLinkDescription(type: ResourceLinkType) {
  switch (type) {
    case ResourceLinkType.REPLACE_CERTIFICATE:
      return 'Skapar en kopia av detta intyg som du kan redigera.'
    case ResourceLinkType.RENEW_CERTIFICATE:
      return 'Skapar en redigerbar kopia av intyget på den enhet som du är inloggad på.'
    case ResourceLinkType.REVOKE_CERTIFICATE:
      return 'Öppnar ett fönster där du kan välja att makulera intyget.'
    case ResourceLinkType.PRINT_CERTIFICATE:
      return 'Öppnar ett fönster där du kan välja att skriva ut eller spara intyget som PDF.'
    case ResourceLinkType.QUESTIONS_NOT_AVAILABLE:
      return 'Hantera kompletteringsbegäran, frågor och svar'
    default:
      return `${type} - ${faker.lorem.sentence()}`
  }
}

export const fakeResourceLink = (data?: Partial<ResourceLink>): ResourceLink => {
  const type = data?.type ?? ResourceLinkType.EDIT_CERTIFICATE
  return {
    type,
    name: fakeResourceLinkName(type),
    description: fakeResourceLinkDescription(type),
    enabled: true,
    ...data,
  }
}
