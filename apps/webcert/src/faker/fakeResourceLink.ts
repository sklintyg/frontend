import faker from 'faker'
import type { ResourceLink } from '../types/resourceLink'
import { ResourceLinkType } from '../types/resourceLink'

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
    case ResourceLinkType.QUESTIONS_NOT_AVAILABLE:
    case ResourceLinkType.QUESTIONS:
      return 'Ärendekommunikation'
    case ResourceLinkType.CREATE_QUESTIONS:
      return 'Ny fråga'
    case ResourceLinkType.FMB:
      return 'FMB'
    case ResourceLinkType.HANDLE_QUESTION:
      return 'Hantera'
    case ResourceLinkType.COMPLEMENT_CERTIFICATE:
      return 'Komplettera'
    case ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE:
    case ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE:
      return 'Kan ej komplettera'
    case ResourceLinkType.REMOVE_CERTIFICATE:
      return 'Radera'
    case ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE:
      return 'Sök / skriv intyg'
    case ResourceLinkType.ACCESS_DRAFT_LIST:
      return 'Ej signerade utkast'
    case ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST:
      return 'Signerade intyg'
    case ResourceLinkType.ACCESS_QUESTION_LIST:
      return 'Ej hanterade ärenden'
    case ResourceLinkType.LOG_OUT:
      return 'Logga ut'
    case ResourceLinkType.SIGN_CERTIFICATE:
      return 'Signera intyget'
    case ResourceLinkType.CREATE_CERTIFICATE:
      return 'Skapa intyg'
    case ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION:
      return 'Visa bekräftelsemodal för dödsbevis'
    case ResourceLinkType.MISSING_RELATED_CERTIFICATE_CONFIRMATION:
      return 'Dödsbevis saknas'
    case ResourceLinkType.CREATE_LUAENA_CONFIRMATION:
      return 'Visa bekräftelsemodal för Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga'
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
    case ResourceLinkType.FMB:
      return 'Läs FMB - ett stöd för ifyllnad och bedömning.'
    case ResourceLinkType.HANDLE_QUESTION:
      return 'Hantera fråga'
    case ResourceLinkType.COMPLEMENT_CERTIFICATE:
      return 'Öppnar ett nytt intygsutkast.'
    case ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE:
    case ResourceLinkType.CANNOT_COMPLEMENT_CERTIFICATE_ONLY_MESSAGE:
      return 'Öppnar en dialogruta med mer information.'
    case ResourceLinkType.FORWARD_QUESTION:
      return 'Skapar ett e-postmeddelande med länk till intyget.'
    case ResourceLinkType.REMOVE_CERTIFICATE:
      return 'Raderar intygsutkastet.'
    case ResourceLinkType.SIGN_CERTIFICATE:
      return 'Intyget signeras.'
    case ResourceLinkType.CREATE_CERTIFICATE:
      return 'Skapa ett intygsutkast.'
    case ResourceLinkType.CREATE_DODSBEVIS_CONFIRMATION:
      return 'Visa modal med ett bekräftelsemeddelande.'
    case ResourceLinkType.CREATE_LUAENA_CONFIRMATION:
      return 'Visa modal med ett bekräftelsemeddelande.'
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
