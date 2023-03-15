import { Doctor } from '../types/Doctor'
import { Unit } from '../types/Unit'

export function fakeLogin(
  { hsaId, forNamn, efterNamn, legitimeradeYrkesgrupper }: Doctor,
  { enhetId }: Unit,
  origin: 'NORMAL' | 'DJUPINTEGRATION' = 'NORMAL'
) {
  return cy.request({
    method: 'POST',
    form: true,
    body: {
      userJsonDisplay: JSON.stringify({
        hsaId,
        forNamn,
        efterNamn,
        legitimeradeYrkesgrupper,
        enhetId,
        origin,
      }),
    },
    url: `${Cypress.config('baseUrl')}/fake`,
  })
}
