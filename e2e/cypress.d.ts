declare namespace Cypress {
  interface Chainable<Subject> {
    removeCertificate(): Chainable<Subject>
    signAndSendCertificate(): Chainable<Subject>
    logout(): Chainable<Subject>
    sendCertificateQuestion(subject: string): Chainable<Subject>
    signCertificate(): Chainable<Subject>
    sendCertificateToFK(): Chainable<Subject>
    printCertificateDraft(): Chainable<Subject>
    replaceCertificate(): Chainable<Subject>
    renewCertificate(): Chainable<Subject>
    copyCertificateDraft(): Chainable<Subject>
    answerCertificateIssue(questionType: string, message: string): Chainable<Subject>
    answerCertificateSupplement(alternativ: 'nyttIntyg' | 'meddelande' | 'textIntyg', message?: string): Chainable<Subject>
    removeCertificateDraft(): Chainable<Subject>
    voidCertificate(): Chainable<Subject>
    voidCertificateDraft(): Chainable<Subject>
    verifyLastCertificate(): Chainable<Subject>
    complementCertificate(): Chainable<Subject>
    forwardCertificate(): Chainable<Subject>
    createAdministratorQuestion(): Chainable<Subject>
    handleQuestion(): Chainable<Subject>
  }
}
