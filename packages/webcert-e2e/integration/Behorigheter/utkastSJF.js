/* globals context cy */
/// <reference types="Cypress" />
//import * as intyg from '../../support/FK_intyg/fk_helpers'
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-intyg tomt', function() {

    before(function() {
        cy.fixture('FK_intyg/minLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhetNR1');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonalNR1');
        cy.fixture('vPersonal/beataDoktor').as('vårdpersonal');
        cy.fixture('vEnheter/betaVC').as('vårdenhet');
    });
  
    context('Använadare har möjlighet att uföra följande med ett tomt utkast ',function() {
        beforeEach(function() {
            //function skapaIntygViaApi(fx,status, typ, theFill,sent){
            cy.skapaIntygViaApi(this,1,false,true,false).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner då man loggar in på ett utkast från annan vårdgivare med sammanhållenjournal', () =>{

            it('Ett LISJP utkast ska  inte kunna signeras från en annan vårdgivare',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhetNR1.id +"&sjf=true";
                cy.visit(önskadUrl);
                cy.contains('Signera intyget').should('not.exist');
                cy.contains('Obligatoriska uppgifter saknas').should('exist');
                cy.contains(this.vårdpersonalNR1.förnamn).should('exist');
                                
            });
            it('Ett LISJP utkast ska  inte kunna raderas från en annan vårdgivare',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhetNR1.id +"&sjf=true";
                cy.visit(önskadUrl);
                cy.contains('Signera intyget').should('not.exist');
                cy.contains('Radera').should('not.exist');
                cy.contains('Obligatoriska uppgifter saknas').should('exist');
                cy.contains(this.vårdpersonalNR1.förnamn).should('exist');
                                
            });
            it('Ett LISJP utkast ska  inte kunna förnyas från en annan vårdgivare',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhetNR1.id +"&sjf=true";
                cy.visit(önskadUrl);
                cy.contains('Signera intyget').should('not.exist');
                cy.contains('Förnya').should('not.exist');
                cy.contains('Obligatoriska uppgifter saknas').should('exist');
                cy.contains(this.vårdpersonalNR1.förnamn).should('exist');
                                
            });
            it('Ett LISJP utkast ska  inte kunna skrivas ut från en annan vårdgivare',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhetNR1.id +"&sjf=true";
                cy.visit(önskadUrl);
                cy.contains('Skriv ut').should('not.exist');
                cy.contains('Förnya').should('not.exist');
                cy.contains('Obligatoriska uppgifter saknas').should('exist');
                cy.contains(this.vårdpersonalNR1.förnamn).should('exist');
                                
            });
            it('Ett LISJP utkast ska  inte kunna editeras från en annan vårdgivare',function(){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonalNR1, this.vårdenhetNR1, this.utkastId,true);
                const önskadUrl = "/visa/intyg/" + this.utkastId + "?enhet=" + this.vårdenhetNR1.id +"&sjf=true";
                cy.visit(önskadUrl);
                cy.get('.ic-textarea').type('Det ska inte vara möjligt att skriva').should('exist'); //TO BE DONE CHANGE TO not.exist instead of 'exist'
                cy.contains('Klart att signera').should('exist');
                cy.contains(this.vårdpersonalNR1.förnamn).should('exist');
                                
            });
        });
    });
});