import { getDoctor } from '../../../../fixtures/getDoctor'
import { getUnit } from '../../../../fixtures/getUnit'
import { createCertificate } from '../../../../helpers/createCertificate'
import { deleteAllPatientCertificate } from '../../../../helpers/deleteAllPatientCertificate'
import { deleteAllPatientEvents } from '../../../../helpers/deleteAllPatientEvents'
import { deleteCertificate } from '../../../../helpers/deleteCertificate'
import { deleteCertificateEvents } from '../../../../helpers/deleteCertificateEvents'
import { fakeLogin } from '../../../../helpers/fakeLogin'
import { getCertificateInfo } from '../../../../helpers/getCertificateInfo'
import { printCertificate } from '../../../../helpers/printCertificate'

const { name, internalType, versions } = getCertificateInfo('doi')

describe(`Signerat ${name} intyg`, () => {
  const unit = getUnit('AlfaVC')
  const doctor = getDoctor('Alja')
  const patientId = '192504289253' // Charlie Olsson
  let certificateId: string

  before(() => {
    deleteAllPatientEvents(patientId)
    deleteAllPatientCertificate(patientId)
  })

  afterEach(() => {
    deleteCertificate(certificateId)
    deleteCertificateEvents(certificateId)
  })

  beforeEach(() => {
    createCertificate({
      certificateType: internalType,
      certificateTypeVersion: versions.at(-1),
      status: 'UNSIGNED',
      fillType: 'EMPTY',
      patientId,
      personId: doctor.hsaId,
      unitId: unit.enhetId,
    }).then((data) => {
      certificateId = data.body.certificateId
      fakeLogin(doctor, unit)
      cy.visit(`/certificate/${certificateId}`)
    })
  })

  it('Ett icke ifylld DOI går ej att signera', () => {
    cy.contains('Signera och skicka').click()

    cy.contains('Obligatoriska uppgifter saknas').should('exist')
    cy.get('[data-testid="certificate-validation"]').within(() => {
      cy.contains('Utkastet saknar uppgifter i följande avsnitt:').should('exist')
      cy.contains('Kompletterande patientuppgifter').should('exist')
      cy.contains('Dödsdatum och dödsplats').should('exist')
      cy.contains('Barn som avlidit senast 28 dygn efter födelsen').should('exist')
      cy.contains('Läkarens utlåtande om dödsorsaken').should('exist')
      cy.contains('Opererad inom fyra veckor före döden').should('exist')
      cy.contains('Skada/förgiftning').should('exist')
      cy.contains('Dödsorsaksuppgifterna grundar sig på').should('exist')
    })

    cy.contains('Utkastet är sparat').should('exist')
  })

  it('Skriva ut ett icke ifyllt DOI', () => {
    printCertificate(certificateId, internalType)
  })

  it('Radera ett icke ifyllt DOI', () => {
    cy.removeCertificateDraft()
    cy.contains(certificateId).should('not.exist')
  })

  it('Fyll i och signera ett DOI', () => {
    // Kompletterande patientuppgifter
    cy.get('[id="textinput"]').eq(0).type('Körkort')

    // Dödsdatum och dödsplats
    cy.get('[id="dodsdatumSakerttrue"]').check({ force: true })
    cy.get('input[placeholder=åååå-mm-dd]').eq(0).type('2022-11-01')
    cy.get('[data-testid="typeahead-3.1"]').type('Kil')
    cy.get('[id="SJUKHUS"]').check({ force: true })

    // Barn som avidit senast 28 dygn efter födelsen
    cy.get('[id="barnfalse"]').should('be.checked')

    // Läkarens utlåtande om dödsorsaken
    cy.get('[id="terminalDodsorsak"]').eq(1).type('Infektion')
    cy.get('[id="8.2"]').type('2021-11-01')
    cy.get('[id="specification_undefined"]').select('Akut').invoke('val').should('eq', 'PLOTSLIG')

    // Operarad inom fyra veckor före döden
    cy.get('[id="NEJ"]').check({ force: true })

    // Skada/Förgiftning
    cy.get('[id="forgiftningfalse"]').check({ force: true })

    // Dödsorsaksuppgifter grundar sig på
    cy.get('[data-testid="13.1UNDERSOKNING_FORE_DODEN"]').check({ force: true })

    // Signera utkast
    cy.contains('Utkastet är sparat').should('be.visible')
    cy.contains('Klart att signera').should('be.visible')
    cy.contains('Signera och skicka').click()
    cy.contains('Intyget är skickat till Socialstyrelsen').should('be.visible')
  })
})
