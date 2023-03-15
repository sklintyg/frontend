export function deleteCertificate(id: string, version: string) {
  return cy.request({ method: 'DELETE', url: `${Cypress.config('baseUrl')}/api/certificate/${id}/${version}` })
}
