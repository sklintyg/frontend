/* globals context cy */
/// <reference types="Cypress" />

import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('LISJP-intyg låst utkast', function() {

    before(function() {
        cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet att uföra följande med låst LISJP Utkast ',function() {
      beforeEach(function() {
           /*   cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');*/
        //function skapaIntygViaApi(fx,status, typ, fillType){
            
            cy.skapaIntygViaApi(this,2,false,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-låst utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett låst LISJP utkast', () =>{
                 
             it('Skriva ut ett låst LISJP utkast', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // intyg.signeraSkicka();
                intyg.skrivUt("utkast", this.utkastId, "lisjp");//skriver ut via request
            });
        
            it('Makulerar ett låst LISJP utkast', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                intyg.makuleraUtkast();
                expect(cy.contains('Intyget är makulerat'))

            });
            it('Kopiera ett låst LISJP utkast så att det går att signera och skicka', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                intyg.kopieraUtkast();
                cy.contains(this.utkastId).should('not.exist')
                intyg.signera();
                intyg.skickaTillFk();
                //expect(cy.contains('Intyget är makulerat'))
             });
            it('Ett LISJP  låst utkast ska  inte kunna editeras',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId;
                cy.visit(önskadUrl);
                cy.get('.ic-textarea').should('be.disabled'); 
                cy.contains('Utkastet är låst').should('exist');                           
            });

        });
    });
});
