export function deleteCertificate(certificateId: string) {
  return cy.request({ method: 'DELETE', url: `${Cypress.config('baseUrl')}/testability/intyg/${certificateId}` })
}
