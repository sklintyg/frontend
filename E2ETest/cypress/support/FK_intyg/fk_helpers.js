/**
 * Denna fil innehåller FK-gemensamma funktioner för att reducera mängden duplicerad kod
 */

 export function besökÖnskadUrl(önskadUrl, vPersonal, vEnhet, utkastId) {
    cy.visit(önskadUrl);
    //cy.get('.intygs-id').should('be.visible');
    // Om vi dirigeras till sidan som säger att 'Intygsutkastet är raderat'
    // så försöker vi igen eftersom det antagligen gick för snabbt.
    cy.get('body').then(($body) => {
        if ($body.text().includes('Intygsutkastet är raderat och kan därför inte längre visas.')) {
            cy.log("Kom till 'Intygetsutkastet är raderat', antagligen gick det för snabbt. Provar igen.");
            cy.loggaInVårdpersonalIntegrerat(vPersonal, vEnhet); // Vi behöver logga in igen
            cy.visit(önskadUrl);
        }
    });
    cy.url().should('include', utkastId);
}

export function loggaUtLoggaIn(vPersonal, vEnhet) {
    // Lite specialvariant av logga ut/logga in för att sedan öppna intyget på nytt med en ny session
   cy.clearCookies();
   cy.visit('/logout')
   cy.loggaInVårdpersonalIntegrerat(vPersonal, vEnhet);
}
export function loggaUt() {
    // loggar ut 
    cy.clearCookies();
    cy.visit('/logout');
}
export function sektionÖvrigt(övrigt) {
    cy.get("#ovrigt").type(övrigt.text);
}

export function sektionKontakt(kontakt) {
    if (kontakt.ja) {
        cy.get("#kontaktMedFk").check();

        if (kontakt.text) {
            cy.get("#anledningTillKontakt").type(kontakt.text);
        }
    }
}
export function signeraSkicka() {
    
    //cy.contains("Klart att signera"); HÄR FINNS EN BUG ATT TA HAND OM
    
    cy.contains("Obligatoriska uppgifter saknas").should('not.exist');
    cy.contains("Utkastet sparas").should('not.exist');
    cy.get('button').contains("Signera och skicka").click();

}
export function skickaFraga(amne) {
    cy.contains("Administrativa frågor").click();
    cy.wait(100);
    cy.get('select').select(amne);
    cy.get('.ic-textarea').type('skickar en fråga angående '+ amne);
    cy.wait(1000);
    cy.get('button').contains('Skicka').click();
    expect(cy.contains('skickar en fråga angående '+ amne)).to.exist;
    cy.contains('Hanterad').click();
       
}

export function signera() {
    // TODO: Utan wait så tappas ofta slutet på texten bort i sista textboxen.
    // Antagligen hinner WebCert inte auto-spara innan man trycker på "signera".
    // Wait är dock ett anti-pattern så finns något annat sätt så är det att föredra.
    cy.wait(1000);

    cy.contains("Klart att signera");
    cy.contains("Obligatoriska uppgifter saknas").should('not.exist');
    cy.contains("Utkastet sparas").should('not.exist');

    // cy.click() fungerar inte alltid. Det finns ärenden rapporterade
    // (stängd pga inaktivitet):
    // https://github.com/cypress-io/cypress/issues/2551
    // https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ :
    // "If a tree falls in the forest and no one has attached a “fall” event listener, did it really fall?"

    //const click = $el => { return $el.click() }

    // Parent() p.g.a. att ett element täcker knappen
    cy.get('button').contains("Signera intyget").click();
    expect(cy.contains("Intyget är tillgängligt för patienten")).to.exist;
  /*  cy.get('#signera-utkast-button').parent().should('be.visible')

    cy.get('#signera-utkast-button')
    .pipe(click, {timeout: 60000}) // ToDo: Lång timeout (problem endast på Jenkins, överlastad slav?)
    .should($el => {
        expect($el.parent()).to.not.be.visible;
    });*/
}

export function skickaTillFk() {
    cy.get('button').contains("Skicka till Försäkringskassan").click();
        // cy.get('button').contains("Avbryt").click();
        // cy.get('button').contains('Skicka till Försäkringskassan').click({force: true}); //testade funkade inte
        cy.get('.ic-modal').within((modal)=>
        {
             cy.get('button').contains('Skicka till Försäkringskassan').click();
        });
   // cy.get("#sendBtn", { timeout: 60000 }).click();

    // Modal som dyker upp och frågar om man verkligen vill skicka
   // cy.get("#button1send-dialog").click();
   // cy.contains("Intyget är skickat till Försäkringskassan");
}
export function skrivUtUtkast(){
    cy.get('button').contains("Skriv ut").click();
    
}
// Generell utskriftsfunktion. Gäller inte för t.ex. LISJP
export function skrivUt(typAvUtskrift, intygsId, intygsTyp){
    const theUrl = 'moduleapi/intyg/' + intygsTyp + '/' + intygsId + "/pdf" + typAvUtskrift;
    switch(typAvUtskrift) {
        case "utkast":
        case "fullständigt":
           
            cy.request({
                method: 'GET',
                url: 'moduleapi/intyg/' + intygsTyp + '/' + intygsId + "/pdf",
            });
            cy.log(theUrl);
            cy.log('Skriver ut ett ' + typAvUtskrift + ' intyg (via cy.request, ej grafiskt)');
            break;
        default:
            cy.log('Ingen korrekt typ av utskrift vald');
    }
}

export function ersatta() {
    cy.get('button').contains("Ersätt").click();
    //cy.get('#fornyaBtn').click();
    //cy.get('.iu-pb-400').then
    
    cy.get('.ic-modal').then((ele) => {
        if(ele.text().includes('Ett intyg kan ersättas om det innehåller felaktiga uppgifter eller om ny information tillkommit efter att intyget utfärdades')) {
            //cy.get('.ic-button-group > :nth-child(1) > .ic-button')
            cy.get('.ic-button-group').contains("Ersätt").click();
            //cy.get('#button1fornya-dialog').click();
        }
    });
}
export function fornya() {
    cy.get('button').contains("Förnya").click();
    //cy.get('#fornyaBtn').click();
    //cy.get('.iu-pb-400').then
    
    cy.get('.ic-modal').then((ele) => {
        if(ele.text().includes('Förnya intyg kan användas vid förlängning av en sjukskrivning')) {
            //cy.get('.ic-button-group > :nth-child(1) > .ic-button')
            cy.get('.ic-button-group').contains("Förnya").click();
            //cy.get('#button1fornya-dialog').click();
        }
    });
}
export function kopieraUtkast(){
    cy.contains('Kopiera').click().then(() => {
        cy.get('.ic-modal').then((ele) => {
            if(ele.text().includes('Kopiera låst utkast')) {
                cy.get('.ic-modal').within((modal)=>
                {
                     cy.get('button').contains('Kopiera').click();
                });
                
            }
        });
    });
}
export function svaraPaKomplettering(alternativ, meddelandeText) {
    switch(alternativ) {
        case "nyttIntyg":
           // cy.get('.ic-modal').within((modal)=>
            //{
            cy.contains('Komplettera').click();
           // });
            break;
        case "meddelande":
            cy.contains('Kan ej komplettera').click();
            cy.get('.ic-modal').within((modal)=>
            {
                cy.contains('Ingen på vårdenheten kan ansvara för det medicinska innehållet i intyget').click();
                cy.get('.ic-textarea').type(meddelandeText);
                cy.contains("Skicka svar").click();
            });
            cy.log("Svarar med meddelande");
            break;
        case "textIntyg":
            cy.contains('Kan ej komplettera').click();
            cy.get('.ic-modal').within((modal)=>
            {
                cy.contains('Ingen ytterligare medicinsk information kan anges.').click();
                cy.get('.ic-textarea').type(meddelandeText);
                cy.contains("Skicka svar").click();
            });
            cy.log("Svarar med text");
           
            break;
        default:
            cy.log('Inget bra alternativ valt');
    }
}
export function raderaUtkast() {
    cy.get('button').contains("Radera").click();
   // cy.get('#ta-bort-utkast').click();
   cy.get('.ic-button-group > :nth-child(1) > .ic-button').click();
   //cy.get('button').contains("Radera").click();  
}
export function makulera() {
    cy.get('button').contains("Makulera").click();
   // cy.get('#ta-bort-utkast').click();
   cy.contains("Intyget har utfärdats på fel patient").click();
      
   cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Intyget har utfärdats på fel patient');
   cy.wait(100);
   cy.get('.ic-button-group > :nth-child(1) > .ic-button').click();
   //cy.get('button').contains("Makulera").click();
   //cy.get('radio').contains("Intyget har utfärdats på fel patient").check();  
}
export function makuleraUtkast() {
    cy.get('button').contains("Makulera").click();
   // cy.get('#ta-bort-utkast').click();
   cy.get('.ic-modal').within((modal)=>
        {
            cy.contains("Utkastet har skapats på fel patient").click();
            cy.get('.ic-radio-group-vertical > :nth-child(2) > .undefined').type('Utkastet har skapats på fel patient');
            cy.wait(1000);
            cy.get('button').contains("Makulera").click();
        });
   
      
   
  // cy.get('.ic-button-group > :nth-child(1) > .ic-button').click();
  
   //cy.get('radio').contains("Intyget har utfärdats på fel patient").check();  
}
export function makuleraIntyg(arg) {
    cy.get('#makuleraBtn').click();
    if (arg === "Annat allvarligt fel") {
        cy.get('#reason-ANNAT_ALLVARLIGT_FEL').check();
        cy.get('#clarification-ANNAT_ALLVARLIGT_FEL').type('Testanledning');
        cy.get('#button1makulera-dialog').click();
    } else {
        cy.get('#reason-FEL_PATIENT').check();
        cy.get('#button1makulera-dialog').click();
    }
}
export function komplettera() {
        cy.wait(3000);
      
        cy.get('#showallstatusesLink > span').click();
        cy.get('body').then(($body) => {        
            if($body.text().includes('Det finns redan en påbörjad komplettering')){           
                cy.get('#confirmationOkButton').click();
                cy.log('Är och kompletterar på det redan skapade');
                cy.get('#komplettera-open-utkast').click();                
            }           
            else { 
                cy.get('#confirmationOkButton').click();
                cy.log('Är och kompletterar på det första');              
                cy.get('#komplettera-intyg').click();                
            }           
        
       });
        
 }
export function vidarebefordra(){
    cy.get('#ta-bort-utkast').click();
    cy.get('#confirm-draft-delete-button').click();
}
export function skapaAdmFraga(){
    cy.contains("Intyget är skickat till Försäkringskassan");
    cy.contains("Obligatoriska uppgifter saknas").should('not.exist');
    cy.contains("Utkastet sparas").should('not.exist');
    cy.get('#arende-filter-administrativafragor').click();
    cy.get('#new-question-topic-selected-item-label').click();
    cy.get('#new-question-topic-AVSTMN').click();
    
    cy.get('#arendeNewModelText').type("SKAPAR ADM FRÅGA").type('{enter}');
    cy.get('#sendArendeBtn').click();
    
}
export function hanteraFraga(){
    cy.get('.checkbox-inline').click();     
}
