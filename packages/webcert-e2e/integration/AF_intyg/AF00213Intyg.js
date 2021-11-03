/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/AF_intyg/af00213Intyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('AF00213-intyg minimalt ifyllt', function() {

    before(function() {
        cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet att uföra följande med AF00213 Intyg ',function() {
      beforeEach(function() {
           /*   cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');*/
        //function skapaIntygViaApi(fx,status, typ, fillType){
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
                //cy.get('button').contains("Skicka till Arbetsförmedlingen").should('not.exist');
                cy.contains(this.utkastId).should('not.exist')
                //cy.get('.CertificateFooter__RightWrapper-sc-1mdu7r7-1 > .iu-fs-200').contains(this.utkastId).should('not.exist');
               
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
