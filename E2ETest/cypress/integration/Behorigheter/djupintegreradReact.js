/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-intyg tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            //UNSIGNED LISJP EMPTY
            cy.skapaIntygViaApi(this,1,false,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett tomt LISJP utkast', () =>{

            it('Ett icke ifylld LISJP går ej att signera och skicka till FK',function(){
             /*   cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhet.id;
               // const önskadUrl = "/certificate/" + this.utkastId ;
                cy.log(önskadUrl);
                cy.visit(önskadUrl);*/
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhet.id;
                //const önskadUrl = "/certificate/" + this.utkastId 
                cy.visit(önskadUrl);
                cy.wait(1000);
                expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                cy.contains("Signera intyget").click();
                cy.get('.ic-page-header').should('exist')
                               
            });
        });
    });
});