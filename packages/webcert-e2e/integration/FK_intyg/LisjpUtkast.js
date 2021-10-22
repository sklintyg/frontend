/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-utkast tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            //UNSIGNED LISJP FILLED
            cy.skapaIntygViaApi(this,1,false,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt LISJP utkast', () =>{
           /* const intygStatus = (status ? "SIGNED" : "UNSIGNED");
            const intygTyp = (typ ? "af00213" : "lisjp");
            const filler = (theFill ?   "MINIMAL" :"EMPTY");*/

            it('Skapar en minimalt ifylld FK7804 och skickar den till FK',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                intyg.signera();

                intyg.skickaTillFk();
                cy.contains("Intyget är skickat till Försäkringskassan");
                cy.contains("Intyget är tillgängligt för patienten");

            });

            it('Det är möjligt att raderar ett ifyllt LISJP', function () {
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    intyg.raderaUtkast();
                    cy.contains(this.utkastId).should('not.exist')

            });

            it('Skriva ut ett ifyllt LISJP', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.skrivUt("utkast", this.utkastId, "lisjp");//skriver ut via request      
            });
            it('Det går inte att signera ett LISJP utkast som inte innehåller alla obligatoriska fält', function () {

                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
               // cy.wait(1000);
                cy.contains("Klart att signera", {timeout:5000}).should('exist');
                
                //cy.get('label').contains('Avstängning enligt smittskyddslagen på grund av smitta. (Fortsätt till frågorna "Diagnos" och "Nedsättning av arbetsförmåga".)').click();
                cy.get('label').contains('100 procent').click();
                cy.contains("Obligatoriska uppgifter saknas", {timeout:5000}).should('exist');
                cy.contains("Klart att signera", {timeout:5000}).should('not.exist');
               
              

            });
        });
    });
});
