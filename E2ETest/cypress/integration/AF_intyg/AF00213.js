/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('AF00213-intyg tomt', function() {

    before(function() {
        cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använader har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            cy.skapaIntygViaApi(this,false,true,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("af00213-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt AF20013 utkast', () =>{

            it('Ett icke ifylld AF00213 går ej att signera och skicka till AF',function(){
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                cy.get('button').contains("Signera och skicka").click();
                expect(cy.contains("Utkastet saknar uppgifter i följande avsnitt:")).to.exist;
                //cy.contains("Utkastet saknar uppgifter i följande avsnitt:");
               expect(cy.get(':nth-child(1) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Funktionsnedsättning")).to.exist;
                //cy.contains("Funktionsnedsättning");
                expect(cy.get(':nth-child(2) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Utredning och behandling")).to.exist;
                expect(cy.get(':nth-child(3) > .CertificateValidation___StyledLink-sc-2b7v8n-0').contains("Arbetets påverkan på sjukdom/skada")).to.exist;
                
            });
            it('Det är möjligt att raderar ett icke ifylld AF00213', function () {
                    //cy.visit('https://wc2.wc.localtest.me/welcome');
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    

                    intyg.raderaUtkast();

            });
            it('Skriva ut ett icke ifyllt AF00213', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                //intyg.skrivUt(typAvUtskrift, intygsId, intygsTyp){
                    intyg.skrivUt("utkast", this.utkastId, "af00213");

                //intyg.skrivUtUtkast();

        });

        });
    });
});
