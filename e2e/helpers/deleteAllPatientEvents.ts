import { getLongPersonId } from './getLongPersonId'

export function deleteAllPatientEvents(personId: string) {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.config('baseUrl')}/testability/intyg/handelser/patient/${getLongPersonId(personId)}`,
  })
}
