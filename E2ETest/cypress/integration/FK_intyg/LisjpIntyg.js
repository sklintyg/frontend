/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/fk_helpers'

// LISJP = Läkarintyg för sjukpenning, FK 7804
describe('FK7804-intyg minimalt ifyllt', function() {

    before(function() {
        cy.fixture('FK_intyg/maxLisjpData').as('intygsdata');
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
            cy.skapaIntygViaApi(this,false,false,true).then((utkastId) => {
                cy.wrap(utkastId).as('utkastId');
                cy.log("Lisjp-utkast med id " + utkastId + " skapat och används i testfallet");
            });

        });
        describe('Funktioner på ett Lisjp intyg', () =>{

            /*  
            function skapaIntygViaApi(fx,status, typ, theFill){
                 const intygStatus = (status ? "SIGNED" : "UNSIGNED");
    const intygTyp = (typ ? "af00213" : "lisjp");
    const filler = (theFill ?   "MINIMAL" :"EMPTY");*/
           
           /* it('Skriva ut minimalt AF00213 intyg', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signeraSkicka();

                intyg.skrivUtUtkast();

            });*/
             it('Makulerar ett signerat LISJP intyg', function () {
                    //cy.visit('https://wc2.wc.localtest.me/welcome');
                    cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                    const önskadUrl = "/certificate/" + this.utkastId ;
                    cy.visit(önskadUrl);
                    cy.wait(100);
                    intyg.signera();

                    intyg.makulera();

            });
            it('Skicka ett signerat LISJP intyg', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);

                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                cy.wait(100);
                //intyg.signeraSkicka();
                //expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
                intyg.signera();
              /*  cy.get('button').contains("Signera intyget").click();
                expect(cy.contains("Intyget är tillgängligt för patienten")).to.exist;*/
               
                cy.get('button').contains("Skicka till Försäkringskassan").click();
               
                cy.get('.ic-button-group > :nth-child(1) > .ic-button').click(); //detta behöver jag hjälp med
                
                expect(cy.contains("Intyget är tillgängligt för patienten")).to.exist;

            });
            it('Skriva ut ett signerat LISJP intyg', function () {
                //cy.visit('https://wc2.wc.localtest.me/welcome');
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.skrivUt("utkast", this.utkastId, "lisjp");//skriver ut via request
            });
            it('Förnya ett LISJP intyg', function (){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.fornya();
                cy.get('button').contains("Skicka till Försäkringskassan").should('not.exist');
               
                cy.contains(this.utkastId).should('not.exist')
               // expect(cy.contains(this.utkastId)).to.not.exist;
                
               // cy.get('.CertificateFooter__RightWrapper-sc-1mdu7r7-1 > .iu-fs-200').contains(this.utkastId).should('not.exist');
               
            });
            it('Ersätta ett LISJP intyg', function (){
                cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
                const önskadUrl = "/certificate/" + this.utkastId ;
                cy.visit(önskadUrl);
                intyg.signera();
                intyg.ersatta();
                cy.get('button').contains("Skicka till Försäkringskassan").should('not.exist');
                cy.contains(this.utkastId).should('not.exist')
                //cy.get('.CertificateFooter__RightWrapper-sc-1mdu7r7-1 > .iu-fs-200').contains(this.utkastId).should('not.exist');
               
            });

        });
    });
});
