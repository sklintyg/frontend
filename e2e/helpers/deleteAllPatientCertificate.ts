import { getLongPersonId } from './getLongPersonId'

export function deleteAllPatientCertificate(personId: string) {
  return cy.request({ method: 'DELETE', url: `${Cypress.config('baseUrl')}/testability/intyg/patient/${getLongPersonId(personId)}` })
}
