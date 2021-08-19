/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('FK7804-intyg Ärende kommunikation', function() {

    before(function() {
        cy.fixture('FK_intyg/maxLisjpData').as('intygsdata');
        cy.fixture('vEnheter/alfaVC').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
        cy.fixture('vPersonal/ajlaDoktor').as('vårdpersonal');
        
    });
  
    context('Användare har möjlighet skicka ärendekommunikation på ett Lisjp intyg ',function() {
      beforeEach(function() {
        
            cy.skapaIntygViaApi(this,true,false,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("Lisjp-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner kring ärendekommunikation på ett Lisjp intyg', () =>{

            /*  
            function skapaIntygViaApi(fx,status, typ, theFill){
                 const intygStatus = (status ? "SIGNED" : "UNSIGNED");
                const intygTyp = (typ ? "af00213" : "lisjp");
                const filler = (theFill ?   "MINIMAL" :"EMPTY");
           
            

            });*/
             it('Skicka fråga gällande Avstämningsmöte på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                cy.get('button').contains("Skicka till Försäkringskassan").click();
               
                cy.get('.ic-modal').within((modal)=>
                {
                    cy.get('button').contains('Skicka till Försäkringskassan').click();
                });
               
                        
                cy.contains("Administrativa frågor").click();
                cy.wait(100);
                cy.get('select').select("Avstämningsmöte");
                cy.get('.ic-textarea').type('skickar en fråga angående Avstämningsmöte.');
                cy.wait(1000);
                cy.get('button').contains('Skicka').click();
                expect(cy.contains('skickar en fråga angående Avstämningsmöte.')).to.exist;
                //cy.get('.iu-mb-800')contains('skickar en fråga angående avstämmningsmöte.').should(exist);
                
               
             });
             it('Skicka fråga gällande Kontakt på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                cy.get('button').contains("Skicka till Försäkringskassan").click();
                cy.get('.ic-button-group > :nth-child(1) > .ic-button').click();
               
                cy.contains("Administrativa frågor").click();
                cy.wait(100);
                cy.get('select').select("Kontakt");
                //cy.get('select[id= "question_form_dropdown"]').select("CONTACT");
                cy.get('.ic-textarea').type('skickar en fråga angående Kontakt.');
                cy.wait(1000);
                cy.get('button').contains('Skicka').click();
                expect(cy.contains('skickar en fråga angående Kontakt.')).to.exist;
                //cy.get('.iu-mb-800')contains('skickar en fråga angående avstämmningsmöte.').should(exist);
                
               
             });
             it('Skicka fråga gällande Övrigt på ett Lisjp intyg', function () {
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                cy.get('button').contains("Skicka till Försäkringskassan").click();
               // cy.get('button').contains("Avbryt").click();
               // cy.get('button').contains('Skicka till Försäkringskassan').click({force: true}); //testade funkade inte
               cy.get('.ic-modal').within((modal)=>
                {
                    cy.get('button').contains('Skicka till Försäkringskassan').click();
                });
                           
                cy.contains("Administrativa frågor").click();
                cy.wait(100);
                cy.get('select').select("Övrigt");
               // cy.get('select[id= "question_form_dropdown"]').select("OTHER");
                cy.get('.ic-textarea').type('skickar en fråga angående Övrigt.');//Här är det lite udda komponent
                cy.wait(1000);
                cy.get('button').contains('Skicka').click();
                expect(cy.contains('skickar en fråga angående Övrigt.')).to.exist;
                //cy.get('.iu-mb-800')contains('skickar en fråga angående avstämmningsmöte.').should(exist);
                
               
             });
         });
     });
});
