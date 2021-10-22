/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/SKR_intyg/AG7804Intyg'

// AG7804 = Läkarintyg om arbetsförmåga – arbetsgivaren, AG 7804
describe('AG7804-intyg minimalt ifyllt', function() {

    before(function() {
        cy.fixture('FK_intyg/maxLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet att uföra följande med FK7804 Intyg ',function() {
      beforeEach(function() {
             //UNSIGNED LISJP FILLED
            cy.skapaIntygViaApi(this,1,2,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("Lisjp-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett AG7804-intyg', () =>{

            it('Makulerar ett signerat AG7804-intyg', function () {
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    cy.wait(100);
                    intyg.signera();
                    intyg.makulera();
                    cy.contains(this.utkastId).should('not.exist')

            });
            it('Skicka ett signerat AG7804-intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                //intyg.signeraSkicka();
                //expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                intyg.signera();
                                           
                expect(cy.contains("Intyget är tillgängligt för patienten")).to.exist;

            });
            it('Skriva ut ett signerat AG7804-intyg', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.skrivUt("utkast", this.utkastId, "ag7804");//skriver ut via request
            });
            it('Förnya ett AG7804-intyg', function (){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.fornya();
                cy.get('button').contains("Intyget är tillgängligt för patienten").should('not.exist');
               
                cy.contains(this.utkastId).should('not.exist')
         
               
            });
            it('Ersätta ett AG7804-intyg', function (){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.ersatta();                
                cy.contains(this.utkastId).should('not.exist')
                               
            });
            

        });
    });
});
