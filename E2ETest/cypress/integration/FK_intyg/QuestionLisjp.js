/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('FK7804-intyg Ärende kommunikation', function() {

    before(function() {
        cy.fixture('FK_intyg/maxLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaMC').as('vårdenhet');
        cy.fixture('vPatienter/athenaAndersson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet skicka ärendekommunikation på ett Lisjp intyg ',function() {
      beforeEach(function() {
        
            cy.skapaIntygViaApi(this,0,false,true,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("Lisjp-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner kring ärendekommunikation på ett Lisjp intyg', () =>{

          it('Skicka fråga gällande Avstämningsmöte på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(100);
               // intyg.skickaTillFk();
                intyg.skickaFraga("Avstämningsmöte");
                //cy.get('.iu-mb-800')contains('skickar en fråga angående avstämmningsmöte.').should(exist);                
               
             });
             it('Skicka fråga gällande Kontakt på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(100);
               // intyg.skickaTillFk();
                intyg.skickaFraga("Kontakt"); 
                //cy.get('.iu-mb-800')contains('skickar en fråga angående avstämmningsmöte.').should(exist);               
               
             });
             it('Skicka fråga gällande Övrigt på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
              //  cy.wait(100);
               // intyg.skickaTillFk();
                intyg.skickaFraga("Övrigt");
                //cy.get('.iu-mb-800').contains('skickar en fråga angående Övrigt.').should(exist);
                
               
             });
             it('Svara på fråga gällande Komplettering  med nytt Intyg på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                //cy.wait(1000);
                //intyg.skickaTillFk();
                cy.wait(1000);
                cy.skapaÄrende(this, this.utkastId,'COMPLEMENT','Nu vill jag ha en komplettering skapad');
                cy.wait(1000);
                cy.reload();
                intyg.svaraPaKomplettering("nyttIntyg", );
                intyg.signeraSkicka();
                cy.contains(this.utkastId).should('not.exist')
               // cy.reload();
                //cy.skickaFraga("Övrigt");
               // cy.get('.iu-mb-800').contains('skickar en fråga angående Övrigt.').should(exist);
                
               
             });
            
             it('Svara på fråga gällande Komplettering  med meddelande på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const medText = "Det är ingen som vill svara så jag svarar med meddelande";
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(1000);
                //intyg.skickaTillFk();
                cy.wait(1000);
                cy.skapaÄrende(this, this.utkastId,'COMPLEMENT','Nu vill jag ha en komplettering skapad');
                cy.wait(1000);
                cy.reload();
                intyg.svaraPaKomplettering("meddelande", medText );
                //cy.reload();
               // cy.wait(500);
                //intyg.signeraSkicka();
               // cy.contains(this.utkastId).should('not.exist')
                cy.contains(medText);
               // cy.reload();
                //cy.skickaFraga("Övrigt");
               // cy.get('.iu-mb-800').contains('skickar en fråga angående Övrigt.').should(exist);
                
               
             });
             it('Svara på fråga gällande Komplettering  med text och nytt Intyg på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const medText = "Det är ingen som vill svara";
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                //cy.wait(100);
               // intyg.skickaTillFk();
                cy.wait(1000);
                cy.skapaÄrende(this, this.utkastId,'COMPLEMENT','Nu vill jag ha en komplettering skapad');
                cy.wait(1000);
                cy.reload();
                intyg.svaraPaKomplettering("textIntyg", medText );
                intyg.signeraSkicka();
                cy.contains(this.utkastId).should('not.exist')
                cy.contains(medText);
               // cy.reload();
                //cy.skickaFraga("Övrigt");
               // cy.get('.iu-mb-800').contains('skickar en fråga angående Övrigt.').should(exist);
                
               
             });
             it('Markera fråga gällande Komplettering på ett Lisjp intyg som hanterad', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const medText = "Det är ingen som vill svara så jag svarar med meddelande";
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(100);
               // intyg.skickaTillFk();
                cy.wait(1000);
                cy.skapaÄrende(this, this.utkastId,'COMPLEMENT','Nu vill jag ha en komplettering skapad');
                cy.wait(1000);
                cy.reload();
                cy.contains('Hanterad').click();
                cy.get('.ic-modal').within((modal)=>
                {
                    cy.get('button').contains('Markera som hanterad').click();
                 });
                cy.wait(700);
                cy.contains('Komplettera').should('not.exist')
                          
               
             });
             it('Markera fråga gällande Övrigt på ett Lisjp intyg som hanterad och avmarkera den sedan', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(100);
               // intyg.skickaTillFk();
                cy.wait(1000);
                cy.skapaÄrende(this, this.utkastId,'OTHER','Detta är en övrigt fråga från FK',false);
                cy.wait(1000);
                cy.reload();
                cy.contains('Administrativa frågor').click();
                cy.contains('Hanterad').click();
                cy.wait(700);
                cy.contains('Svara').should('not.exist');
                cy.contains('Hanterad').click();
                cy.contains('Svara').should('exist');

             });
             it('Svara på fråga gällande Kontakt på ett Lisjp intyg som har en påminnelse.', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const medText = "this is an answer";
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
               // cy.wait(100);
               // intyg.skickaTillFk();
                cy.wait(700);
                cy.skapaÄrende(this, this.utkastId,'CONTACT','Detta är en övrigt fråga från FK',true);
                cy.wait(1500);
                cy.reload();
                cy.contains('Administrativa frågor').click();
                cy.contains('Svara').should('exist');
                cy.contains('Påminnelse').should('exist');
                intyg.svaraPåÄrende('Kontakt', medText);
                cy.wait(700);
                cy.contains('Påminnelse').should('not.exist');
                cy.contains('Svara').should('not.exist');
               

             });
             it('Svara på fråga gällande Avstämningsmöte på ett Lisjp intyg som har en påminnelse.', function () {
               cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
               const medText = "this is an answer";
               const önskadUrl = "/certificate/" + this.utkastId ;
               cy.visit(önskadUrl);
              // cy.wait(100);
              // intyg.skickaTillFk();
               cy.wait(700);
               cy.skapaÄrende(this, this.utkastId,'COORDINATION','Detta är en övrigt fråga från FK',true);
               cy.wait(1500);
               cy.reload();
               cy.contains('Administrativa frågor').click();
               cy.contains('Svara').should('exist');
               cy.contains('Påminnelse').should('exist');
               intyg.svaraPåÄrende('Avstämningsmöte', medText);
               cy.wait(700);
               cy.contains('Påminnelse').should('not.exist');
               cy.contains('Svara').should('not.exist');
              

            });
            it('Svara på fråga gällande Övrigt på ett Lisjp intyg som har en påminnelse.', function () {
               cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
               const medText = "this is an answer";
               const önskadUrl = "/certificate/" + this.utkastId ;
               cy.visit(önskadUrl);
               //cy.wait(100);
              // intyg.skickaTillFk();
               cy.wait(700);
               cy.skapaÄrende(this, this.utkastId,'OTHER','Detta är en övrigt fråga från FK',true);
               cy.wait(1500);
               cy.reload();
               cy.contains('Administrativa frågor').click();
               cy.contains('Svara').should('exist');
               cy.contains('Påminnelse').should('exist');
               intyg.svaraPåÄrende('Övrigt', medText);
               cy.wait(700);
               cy.contains('Påminnelse').should('not.exist');
               cy.contains('Svara').should('not.exist');
              

            });
         });
     });
});
