import { Doctor } from '../types/Doctor'
import { Unit } from '../types/Unit'

export function fakeLogin(doctor: Doctor, unit: Unit, origin: 'NORMAL' | 'DJUPINTEGRATION' = 'NORMAL') {
  return cy.request({
    method: 'POST',
    form: true,
    body: {
      userJsonDisplay: `{"hsaId": "${doctor.hsaId}","forNamn": "${doctor.förnamn}","efterNamn": "${doctor.efternamn}","enhetId": "${unit.enhetsId}","legitimeradeYrkesgrupper": ${doctor.legitimeradeYrkesgrupper},"origin": "${origin}"}`,
    },
    url: `${Cypress.config('baseUrl')}/fake`,
  })
}
