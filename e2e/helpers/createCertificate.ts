export function createCertificate({
  status = 'SIGNED',
  fillType = 'EMPTY',
  sent = false,
  ...body
}: {
  certificateType: string
  certificateTypeVersion: string
  patientId: string
  personId: string
  unitId: string
  status?: 'SIGNED' | 'UNSIGNED' | 'LOCKED'
  fillType?: 'EMPTY' | 'MINIMAL' | 'MAXIMAL'
  sent?: boolean
}) {
  return cy.request<{ certificateId: 'string' }>({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/testability/certificate`,
    body: {
      status,
      fillType,
      sent,
      ...body,
    },
  })
}
