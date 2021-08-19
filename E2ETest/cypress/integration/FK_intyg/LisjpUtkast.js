/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-utkast tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            cy.skapaIntygViaApi(this,false,false,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt LISJP utkast', () =>{
           /* const intygStatus = (status ? "SIGNED" : "UNSIGNED");
            const intygTyp = (typ ? "af00213" : "lisjp");
            const filler = (theFill ?   "MINIMAL" :"EMPTY");*/

            it('Ett icke ifylld LISJP går ej att signera och skicka till AF',function(){
                
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                cy.get('button').contains("Signera intyget").click();
                expect(cy.contains("Utkastet saknar uppgifter i följande avsnitt:")).to.exist; //Nedan också
                cy.contains('Grund för medicinskt underlag').should('exist')
                cy.contains('Sysselsättning').should('exist')
                cy.contains('Diagnos').should('exist')
                cy.contains('Sjukdomens konsekvenser för patienten').should('exist')
                cy.contains('Bedömning').should('exist')
                cy.contains('Åtgärder').should('exist')// borde ju vara så här men vill ju kolla så att varningen nedan är rätt
               
                expect(cy.get(':nth-child(1) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Grund för medicinskt underlag")).to.exist;
                expect(cy.get(':nth-child(2) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sysselsättning")).to.exist;
                expect(cy.get(':nth-child(3) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Diagnos")).to.exist;
                expect(cy.get(':nth-child(4) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sjukdomens konsekvenser för patienten")).to.exist;
                expect(cy.get(':nth-child(5) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sjukdomens konsekvenser för patienten")).to.exist;
                expect(cy.get(':nth-child(6) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Bedömning")).to.exist;
                expect(cy.get(':nth-child(7) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Bedömning")).to.exist;
                expect(cy.get(':nth-child(8) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Åtgärder")).to.exist;
                cy.get('button').contains("Skicka till Försäkringskassan").should('not.exist');
                
            });

            it('Det är möjligt att raderar ett icke ifyllt LISJP', function () {
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    intyg.raderaUtkast();

            });

            it('Skriva ut ett icke ifyllt LISJP', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.skrivUt("utkast", this.utkastId, "lisjp");//skriver ut via request

                
        });

        });
    });
});
