import * as fk from '../FK_intyg/fk_helpers';

// Intyget är uppdelat på samma sätt som det är uppdelat när det fylls i genom WebCert

// Datumen är inte specifika för något testfall

// De funktioner etc. som är gemensamma för många intyg kan exporteras direkt
export {
    besökÖnskadUrl, loggaUtLoggaIn, sektionÖvrigt, sektionKontakt, loggaUt, kopiera,skrivUt,
    skickaTillFk, fornya, raderaUtkast, makuleraIntyg,makuleraUtkast, signera, makulera, ersatta, kopieraUtkast
} from '../FK_intyg/fk_helpers';


export function verifieraMeddelande() {
    //iu-pt-400 iu-pb-400 iu-mt-400 iu-bg-white iu-radius-sm contentPaperWrapper  ic-error-icon
    cy.get('.iu-pt-400').within((texter)=>
    {
       // expect(cy.contains("Obligatoriska uppgifter saknas")).to.exist;
               // cy.get('button').contains("Signera intyget").click();
                expect(cy.contains("Utkastet saknar uppgifter i följande avsnitt:")).to.exist; //Nedan också
                cy.contains('Grund för medicinskt underlag').should('exist')
                cy.contains('Sysselsättning').should('exist')
                cy.contains('Diagnos').should('exist')
                cy.contains('Sjukdomens konsekvenser för patienten').should('exist')
                cy.contains('Bedömning').should('exist')
                cy.contains('Åtgärder').should('exist')
    });
}
