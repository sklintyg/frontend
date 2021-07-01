/* globals context cy */
/// <reference types="Cypress" />
import * as intyg from '../../support/FK_intyg/lisjpIntyg'

// LISJP = Läkarintyg för sjukpenning, FK 7804

describe('LISJP-intyg', function () {

    before(function() {
        cy.fixture('FK_intyg/maxLisjpData').as('intygsdata');
        cy.fixture('vPersonal/arnoldJohansson').as('vårdpersonal');
        cy.fixture('vEnheter/alfaEnheten').as('vårdenhet');
        cy.fixture('vPatienter/tolvanTolvansson').as('vårdtagare');
    });

    beforeEach(function() {
        cy.skapaIntygViaApi(this,"LOCKED","LISJP").then((utkastId) =>  {
            cy.wrap(utkastId).as('utkastId');
            cy.log("LISJP-utkast med id " + utkastId + " skapat och används i testfallet");
            
            
        });
    });

    it('skapar en maximalt ifylld LISJP och skickar den till FK', function () {
     /*   cy.visit("https://webcert-frontend.intyg.nordicmedtest.se/welcome")
        
        let intygsid = "c4be4edc-930f-4494-9188-161e7687e0e5";
        cy.get('[placeholder="intygsid"]').type(intygsid)
        cy.get('button').contains("Logga in").click()*/
        //intyg.besökÖnskadUrl(önskadUrl, this.vårdpersonal, this.vårdenhet, this.utkastId);
        //cy.visit("https://wc2.localtest.me/welcome");
        //const theUrl = "https://wc2.localtest.me/certificate/" + this.utkastId;
        //cy.log(theUrl);

        cy.visit("https://wc2.localtest.me/certificate/" + this.utkastId);
        cy.get('Checkbox__Label-sc-1ufaskb-1 eoSZnF').check();
     //cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
       //cy.get('.Welcome__StyledInput-sc-1moirtn-3').type(this.utkastId);
        //cy.get('.ic-button').click();
       // cy.visit ("certificate/" + this.utkastId);
        //cy.pause();
        //cy.wait(30000);
        //cy.get('Checkbox__Label-sc-1ufaskb-1 eoSZnF').check();

    
        //cy.loggaInVårdpersonalIntegrerat(this.vårdpersonal, this.vårdenhet, this.utkastId);
      
        //const önskadUrl = "/api/certificate/" + this.utkastId + "/validate";// + "?enhet=" + this.vårdenhet.id
        //intyg.besökÖnskadUrl(önskadUrl, this.vårdpersonal, this.vårdenhet, this.utkastId);

        //intyg.sektionGrundFörMedicinsktUnderlag(this.intygsdata.grundFörMedicinsktUnderlag);
       // intyg.sektionSysselsättning(this.intygsdata.sysselsättning);
        //intyg.sektionDiagnos(this.intygsdata.diagnos);
        //intyg.sektionSjukdomensKonsekvenserFörPatienten(this.intygsdata.sjukdomensKonsekvenserFörPatienten);
        //intyg.sektionMedicinskBehandling(this.intygsdata.medicinskBehandling);
        //intyg.sektionBedömning(this.intygsdata.bedömning);
        //intyg.sektionÅtgärder(this.intygsdata.åtgärder);
        /*intyg.sektionÖvrigt(this.intygsdata.övrigt);
        intyg.sektionKontakt(this.intygsdata.kontakt);
        intyg.signera();
        intyg.skickaTillFk();*/
    });
});