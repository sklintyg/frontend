interface Vårdpersonal {
  efternamn: string
  förnamn: string
  hsaId: string
  id: string
  legitimeradeYrkesgrupper: string
}

interface Vårdenhet {
  id: string
}

interface Vårdtagare {
  personnummerKompakt: string
}

declare namespace Cypress {
  interface Chainable {
    skapaIntygViaApi(
      fx: { vårdpersonal: Vårdpersonal; vårdenhet: Vårdenhet; hsaId: string; vårdtagare: Vårdtagare },
      status: string,
      typ: string,
      fillType: string,
      sent?: boolean
    ): Chainable<void>
    skapaÄrende(intygsId: string, typAvFråga: string, meddelande: string, reminder: boolean): Chainable<void>
    taBortIntyg(intygsID: string): Chainable<void>
    rensaIntyg(personnummer: string, personnummerKompakt: string): Chainable<void>
    loggaInVårdpersonal(vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string, origin: string): Chainable<void>
    loggaInVårdpersonalNormal(vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string): Chainable<void>
    loggaInVårdpersonalIntegrerat(vårdpersonal: Vårdpersonal, vårdenhet: Vårdenhet, intygsId: string): Chainable<void>
  }
}
