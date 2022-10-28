/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/AF_intyg/af00213Intyg'

/**
 * AF00213 = Arbetsförmedlingens medicinska utlåtande, AF 00213
 */

describe('AF00213-intyg minimalt ifyllt', function() {

    before(function() {
        cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet att uföra följande med AF00213 Intyg ',function() {
      beforeEach(function() {
            cy.skapaIntygViaApi(this,1,0,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("af00213-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });

        describe('Funktioner på ett AF20013 intyg', () =>{
            it('Skriva ut ett signerat AF20013 intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signeraSkicka();
                intyg.skrivUt("utkast", this.utkastId, "af00213");//skriver ut via request
            });

            it('Ersätta ett AF00213 intyg', function (){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signeraSkicka();
                intyg.ersatta();
                cy.contains(this.utkastId).should('not.exist')
            });

            it('Makulerar ett ifyllt AF00213 intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                intyg.signeraSkicka();
                intyg.makulera();
                cy.contains(this.utkastId).should('not.exist')
            });
        });
    });
});
