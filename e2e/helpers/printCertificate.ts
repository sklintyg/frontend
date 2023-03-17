/**
 * Generell utskriftsfunktion. Gäller inte för t.ex. LISJP
 */
export function printCertificate(certificateId: string, certificateType: string) {
  return cy.request({
    method: 'GET',
    url: `moduleapi/intyg/${certificateType}/${certificateId}/pdf`,
  })
}
