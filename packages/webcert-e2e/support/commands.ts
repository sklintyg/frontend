// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands

// TODO: Ska dessa konstanter vara deklarerade här eller ska vi ha en
// egen fil med enbart konstanter?
// Dessa konstanter är exakt så som specificerat i
// "Kodverk i nationella tjänsteplattformen", "KV intygstyp"
// https://riv-ta.atlassian.net/wiki/pages/viewpageattachments.action?pageId=270532953
export const implementeradeIntyg = {
  LISJP: 'LISJP',
  LUSE: 'LUSE',
  LUAE_NA: 'LUAE_NA',
  LUAE_FS: 'LUAE_FS',
  TS_BAS: 'TSTRK1007',
  TS_DIABETES: 'TSTRK1031',
  TS_ANMÄLAN: 'TSTRK1009',
  TS_ADHD: 'TSTRK1062',
  AFMU: 'AF00213',
  AF00251: 'AF00251',
  DB: 'DB',
  DOI: 'DOI',
  AG7804: 'AG7804',
  AG114: 'AG1-14',
}

Cypress.Commands.add(
  'skapaIntygViaApi',
  (
    fx: { vårdpersonal: Vårdpersonal; vårdenhet: Vårdenhet; hsaId: string; vårdtagare: Vårdtagare },
    status: string,
    typ: string,
    fillType: string,
    sent?: boolean
  ) => {
    const { vårdpersonal, vårdenhet, hsaId, vårdtagare } = fx
    const theStatus = ['SIGNED', 'UNSIGNED', 'LOCKED']
    const intygStatus = theStatus[status]
    const beingSent = !!sent
    const intygTyp = ['af00213', 'lisjp', 'ag7804', 'db', 'doi']
    const intygsTypen = intygTyp[typ]
    const filler = fillType ? 'MINIMAL' : 'EMPTY'

    expect(vårdpersonal).to.exist
    expect(vårdenhet).to.exist
    expect(vårdtagare).to.exist
    expect(hsaId).to.exist

    cy.clearCookies()
    cy.request({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/testability/certificate/`,
      body: {
        certificateType: intygsTypen,
        certificateTypeVersion: '1.0',
        patientId: vårdtagare.personnummerKompakt, // "191212121212",
        personId: hsaId, // "TSTNMT2321000156-DRAA",
        unitId: vårdenhet.id, // "TSTNMT2321000156-ALVC",
        status: intygStatus,
        fillType: filler,
        sent: beingSent,
      },
    }).then((resp) => {
      expect(resp.status).to.equal(200)
      // Utan detta klagar Cypress på att man blandar synkron och asynkron kod
      cy.wrap(resp.body.certificateId).then((id) => id)
    })
  }
)

Cypress.Commands.add('skapaÄrende', (intygsId: string, typAvFråga: string, meddelande: string, reminder: boolean) => {
  cy.log(typAvFråga)
  const remind = !!reminder

  cy.request({
    method: 'POST',
    url: `${Cypress.config('baseUrl')}/testability/certificate/${intygsId}/question`,
    body: {
      type: typAvFråga,
      message: meddelande,
      answerAsDraft: false,
      reminded: remind,
    },
  }).then((resp) => {
    expect(resp.status).to.equal(200)
    // Utan detta klagar Cypress på att man blandar synkron och asynkron kod
    cy.wrap(resp.body.certificateId).then((id) => id)
  })
})

Cypress.Commands.add('taBortIntyg', (intygsID: string) => {
  const intygsUrl = `${Cypress.env('intygTjanstUrl')}/inera-certificate/resources/certificate/${intygsID}`

  cy.log(intygsID)
  cy.request({
    method: 'DELETE',
    url: intygsUrl,
  }).then((resp) => {
    expect(resp.status).to.equal(200)
  })
})

Cypress.Commands.add('rensaIntyg', (personnummer: string, personnummerKompakt: string) => {
  cy.request({
    method: 'DELETE',
    url: `/testability/intyg/handelser/patient/${personnummerKompakt}`,
  }).then((resp) => {
    expect(resp.status).to.equal(200)
  })

  cy.request({
    method: 'DELETE',
    url: `/testability/intyg/patient/${personnummer}`,
  }).then((resp) => {
    expect(resp.status).to.equal(200)
  })
  const intygsUrl = `${Cypress.env('intygTjanstUrl')}/inera-certificate/resources/certificate/citizen/`
  cy.request({
    method: 'DELETE',
    url: intygsUrl + personnummer,
  }).then((resp) => {
    expect(resp.status).to.equal(200)
  })
})

Cypress.Commands.add('loggaInVårdpersonal', (vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string, origin = 'NORMAL') => {
  expect(vårdpersonal).to.exist
  expect(vårdenhet).to.exist
  expect(intygsId).to.exist
  const theUrl = `${Cypress.config('baseUrl')}/fake`
  cy.log(vårdpersonal.förnamn + vårdpersonal.efternamn + vårdpersonal.hsaId)
  cy.request({
    method: 'POST',
    url: theUrl,
    form: true,
    body: {
      userJsonDisplay: `{"hsaId": "${vårdpersonal.hsaId}","forNamn": "${vårdpersonal.förnamn}","efterNamn": "${vårdpersonal.efternamn}","enhetId": "${vårdenhet.id}","legitimeradeYrkesgrupper": ${vårdpersonal.legitimeradeYrkesgrupper},"origin": "${origin}"}`,
    },
  }).then((resp) => {
    expect(resp.status).to.equal(200)
  })

  cy.log(vårdpersonal.förnamn + vårdpersonal.efternamn + vårdpersonal.hsaId)
})

Cypress.Commands.add('loggaInVårdpersonalNormal', (vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string) => {
  cy.loggaInVårdpersonal(vårdpersonal, vårdenhet, intygsId, 'NORMAL')
})

Cypress.Commands.add('loggaInVårdpersonalIntegrerat', (vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string) => {
  // loggaInVårdpersonal(vårdpersonal, vårdenhet, intygsId, true)
  cy.loggaInVårdpersonal(vårdpersonal, vårdenhet, intygsId, 'DJUPINTEGRATION')
})
