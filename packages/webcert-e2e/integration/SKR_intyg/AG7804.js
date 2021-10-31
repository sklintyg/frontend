/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

// AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804

xdescribe('AG7804-intyg tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            //UNSIGNED LISJP EMPTY
            cy.skapaIntygViaApi(this,1,2,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt AG7804 utkast', () =>{

            it('Ett icke ifylld AG7804 går ej att signera och skicka till FK',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                cy.contains("Signera intyget").click();
                intyg.verifieraMeddelande();
               /* 
                expect(cy.contains("Utkastet saknar uppgifter i följande avsnitt:")).to.exist;
                expect(cy.get(':nth-child(1) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Grund för medicinskt underlag")).to.exist;
                expect(cy.get(':nth-child(2) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sysselsättning")).to.exist;
                expect(cy.get(':nth-child(3) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Diagnos")).to.exist;
                expect(cy.get(':nth-child(4) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sjukdomens konsekvenser för patienten")).to.exist;
                expect(cy.get(':nth-child(5) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Sjukdomens konsekvenser för patienten")).to.exist;
                expect(cy.get(':nth-child(6) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Bedömning")).to.exist;
                expect(cy.get(':nth-child(7) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Bedömning")).to.exist;
                expect(cy.get(':nth-child(8) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Åtgärder")).to.exist;*/
                cy.get('button').contains("Skicka till Försäkringskassan").should('not.exist');
                
            });
            it('Det är möjligt att raderar ett icke ifyllt AG7804', function () {
                    
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl); 
                    intyg.raderaUtkast();
                    cy.contains(this.utkastId).should('not.exist')

            });
            it('Skriva ut ett icke ifyllt AG7804', function () {
                
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.skrivUt("utkast", this.utkastId, "ag7804");//skriver ut via request

            });

        });
    });
});