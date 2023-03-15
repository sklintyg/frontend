declare namespace Cypress {
  interface Chainable<Subject> {
    removeCertificate(): Chainable<Subject>
    signAndSendCertificate(): Chainable<Subject>
  }
}
