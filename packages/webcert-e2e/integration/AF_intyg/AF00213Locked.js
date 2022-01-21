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
  
    context('Användare har möjlighet att uföra följande med låst AF00213 Utkast ',function() {
      beforeEach(function() {
           /*   cy.fixture('AF_intyg/maxAF00213Data').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');*/
        //function skapaIntygViaApi(fx,status, typ, fillType){
            const status = 2;//sätter utkastet till låst
            cy.skapaIntygViaApi(this,status,0,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("af00213-låst utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett låst AF20013 utkast', () =>{

             
            it('Skriva ut ett låst AF00213 utkast', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // intyg.signeraSkicka();
                intyg.skrivUt("utkast", this.utkastId, "af00213");//skriver ut via request
            });
            it('Makulerar ett låst AF00213 utkast', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                intyg.makuleraUtkast();
                expect(cy.contains('Utkastet är makulerat'));
            });
            it('Kopiera ett låst AF00213 utkast så att det går att signera och skicka', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                intyg.kopieraUtkast();
                cy.contains(this.utkastId).should('not.exist')
                intyg.signeraSkicka();
            });
            it('Ett AF00213 låst utkast ska  inte kunna editeras',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId;
                cy.visit(önskadUrl);
                cy.get('.ic-textarea').should('be.disabled'); 
                cy.contains('Utkastet är låst').should('exist');
               
                                
            });

        });
    });
});
