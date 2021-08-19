/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('AF00213-intyg', function() {

    before(function() {
        cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använader har möjlighet att uföra följande med utkast ',function() {
        beforeEach(function() {
            cy.skapaIntygViaApi(this,false,true,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("af00213-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett AF20013 utkast', () =>{

            it('Skapar en minimalt ifylld AF00213 och skickar den till AF',function(){
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                intyg.signeraSkicka();

                cy.contains("Intyget är skickat till Arbetsförmedlingen");
                cy.contains("Intyget är tillgängligt för patienten");

            });
            it('Raderar ett ifylld AF00213', function () {
                    //cy.visit('https://wc2.wc.localtest.me/welcome');
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    

                    intyg.raderaUtkast();

            });
           /* it('Skriva ut AF00213', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                //intyg.skrivUt(typAvUtskrift, intygsId, intygsTyp){
                    intyg.skrivUt("utkast", this.utkastId, "af00213");

                intyg.skrivUtUtkast();

            });*/

        });
    });
});
