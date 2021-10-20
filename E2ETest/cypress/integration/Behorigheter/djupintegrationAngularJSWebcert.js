/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-intyg tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/betaVC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/beataDoktor').as('vårdpersonal');
      /*  cy.skapaLisjpUtkast(this).then((utkastId) => {
        
            cy.wrap(utkastId).as('utkastId');
            cy.log("LISJP förifyllt utkast med id " + utkastId + " skapat och används i testfallet");
        });*/
        
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
           
            //UNSIGNED LISJP EMPTY
            cy.skapaIntygViaApi(this,1,1,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt LISJP utkast (ignore)', () =>{

            it('Ett icke ifylld LISJP går ej att signera och skicka till FK',function(){
                Cypress.config('baseUrl', "https://wc.localtest.me")
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhet.id;
                
                cy.visit(önskadUrl);
                expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                cy.contains("Signera intyget").click();
                cy.get('.ic-page-header').should('not.exist')
                
            });
        });
    });
});