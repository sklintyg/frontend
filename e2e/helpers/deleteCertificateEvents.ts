export function deleteCertificateEvents(certificateId: string) {
  return cy.request({ method: 'DELETE', url: `${Cypress.config('baseUrl')}/testability/intyg/handelser/${certificateId}` })
}
