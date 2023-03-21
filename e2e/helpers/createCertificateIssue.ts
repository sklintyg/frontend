export function createCertificateIssue(
  certificateId: string,
  type: 'COMPLEMENT' | 'OTHER' | 'CONTACT' | 'COORDINATION',
  message: string,
  reminded = false,
  answerAsDraft = false
) {
  return cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/testability/certificate/${certificateId}/question`,
    body: {
      type,
      message,
      answerAsDraft,
      reminded,
    },
  })
}
