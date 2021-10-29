// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands

// TODO: Ska dessa konstanter vara deklarerade här eller ska vi ha en
// egen fil med enbart konstanter?
// Dessa konstanter är exakt så som specificerat i
// "Kodverk i nationella tjänsteplattformen", "KV intygstyp"
// https://riv-ta.atlassian.net/wiki/pages/viewpageattachments.action?pageId=270532953
export const implementeradeIntyg = {
    LISJP: "LISJP",
    LUSE: "LUSE",
    LUAE_NA: "LUAE_NA",
    LUAE_FS: "LUAE_FS",
    TS_BAS: "TSTRK1007",
    TS_DIABETES: "TSTRK1031",
    TS_ANMÄLAN: "TSTRK1009",
    TS_ADHD: "TSTRK1062",
    AFMU: "AF00213",
    AF00251: "AF00251",
    DB: "DB",
    DOI: "DOI",
    AG7804: "AG7804",
    AG114: "AG1-14"
}


function loggaInVårdpersonal(vårdpersonal, vårdenhet, intygsId, ärDjup) {
    expect(vårdpersonal).to.exist;
    expect(vårdenhet).to.exist;
    expect(intygsId).to.exist;
  const theUrl = Cypress.env('webcertUrl') + '/fake';
   //const theUrl: '/fake';
    //assert.isBoolean(ärDjup);  "/api/certificate/" + utkastId + "/validate",
  //const originSträng =  "DJUPINTEGRATION";
  //"authenticationMethod": "FAKE"
    const originSträng = (ärDjup ? "DJUPINTEGRATION" : "NORMAL");
    cy.log(vårdpersonal.förnamn + vårdpersonal.efternamn+vårdpersonal.hsaId);
    cy.request({
        method: 'POST',
        url: theUrl,
        form: true,
        body: {
            "userJsonDisplay":
                '{"hsaId": "' + vårdpersonal.hsaId + '",\
                "forNamn": "' + vårdpersonal.förnamn + '",\
                "efterNamn": "' + vårdpersonal.efternamn +'",\
                "enhetId": "' + vårdenhet.id + '",\
                "legitimeradeYrkesgrupper": ' + vårdpersonal.legitimeradeYrkesgrupper + ',\
                "origin": "' + originSträng + '"}'
        }
    }).then((resp) => {
        //cy.log("json:" ,JSON.stringify(resp));
        expect(resp.status).to.equal(200);


    });

    cy.log(vårdpersonal.förnamn + vårdpersonal.efternamn+vårdpersonal.hsaId);
}
//typer av frågor: MISSING, COORDINATION, CONTACT, OTHER, COMPLEMENT private QuestionType type;
 /*   private String message;
    private String answer;
    private boolean answerAsDraft;
    private boolean reminded;*/

function skapaÄrende(fx,intygsId, typAvFråga, meddelande,reminder){
    cy.log(typAvFråga);
    const remind = (reminder ? true : false);

    cy.request({
        method: 'POST',
        url: Cypress.env('webcertUrl') + '/testability/certificate/' + intygsId + '/question',
        raw: true,
       body:{
            "type": typAvFråga,
            "message": meddelande,
            "answerAsDraft": false,
            "reminded": remind
        }
    }).then((resp) => {
        expect(resp.status).to.equal(200);
        //cy.log("IntygsID");
        //cy.log(resp.body.certificateId);
        //cy.log("json:" ,JSON.stringify(resp));
        //cy.wrap(resp).its('Body.certificatId').then((intygsID) => {
           // cy.log("IntygsID i return:" + intygsID);

            // Utan detta klagar Cypress på att man blandar synkron och asynkron kod
            cy.wrap(resp.body.certificateId).then((id) => {

                return id;
            });

       // });
    });

}
// cy.skapaIntygViaApi(this,"SIGNED","lisjp","MAXIMAL")
function skapaIntygViaApi(fx,status, typ, theFill,sent){
   // cy.log("skickar mot API "+ status);
    const vårdpersonal = fx.vårdpersonal;
    const läkare = fx.vårdpersonal;
    const vårdenhet = fx.vårdenhet;
    const patient = fx.vårdtagare;
    const theStatus = ["SIGNED" , "UNSIGNED", "LOCKED"];
    const intygStatus = theStatus[status];
    const beingSent =(sent ? true : false );
   // cy.log(intygStatus);
    const intygTyp = ["af00213" , "lisjp","ag7804"];
    const intygsTypen = intygTyp[typ];
    const filler = (theFill ?   "MINIMAL" :"EMPTY");
    //cy.log(intygStatus + intygTyp + filler);
    expect(vårdpersonal).to.exist;
    expect(vårdenhet).to.exist;
    expect(patient).to.exist;
    expect(läkare).to.exist;
    cy.clearCookies(true);
    cy.request({
        method: 'POST',
        url: Cypress.env('webcertUrl') + '/testability/certificate/',
        raw: true,
        body:{
            "certificateType":intygsTypen,
            "certificateTypeVersion":"1.0",
            "patientId":patient.personnummerKompakt,//"191212121212",
            "personId":läkare.hsaId,//"TSTNMT2321000156-DRAA",
            "unitId":vårdenhet.id,//"TSTNMT2321000156-ALVC",
            "status":intygStatus,
            "fillType": filler,
            "sent": beingSent
        }
        }).then((resp) => {
            expect(resp.status).to.equal(200);
            // Utan detta klagar Cypress på att man blandar synkron och asynkron kod
            cy.wrap(resp.body.certificateId).then((id) => {

            return id;
        });
    });

}


Cypress.Commands.add("skapaIntygViaApi",(fx,status, typ,fillType, sent) => {
    skapaIntygViaApi(fx,status,typ,fillType,sent);

});
Cypress.Commands.add("skapaÄrende", (fx,intygsId, typAvFråga, meddelande,reminder) => {
    skapaÄrende(fx,intygsId, typAvFråga, meddelande,reminder);
});


function rensaIntyg(fx){

    cy.request({
    method: 'DELETE',
    url: '/testability/intyg/handelser/patient/' + fx.personnummerKompakt,
    }).then((resp) =>{
        expect(resp.status).to.equal(200);
    });

     cy.request({
        method: 'DELETE',
        url: '/testability/intyg/patient/' + fx.personnummer,
        }).then((resp) =>{
            expect(resp.status).to.equal(200);
        });
        const intygsUrl = Cypress.env('intygTjanstUrl') + "/inera-certificate/resources/certificate/citizen/";
    //expect(Object.values(implementeradeIntyg)).to.include.members([intygstyp]);
    //cy.log(vårdtagare.personnummerKompakt + vårdtagare.förnamn +vårdtagare.efternamn + vårdtagare.postadress + vårdtagare.postnummer + vårdtagare.postort);
        cy.request({
            method: 'DELETE',
            url: intygsUrl + fx.personnummer,
            }).then((resp) =>{
                expect(resp.status).to.equal(200);
            });

}
function taBortIntyg(fx) {

    const intygsID = fx.intygsID
    const intygsUrl = Cypress.env('intygTjanstUrl') + "/inera-certificate/resources/certificate/" + intygsID;

    cy.log(intygsID);
    cy.request({
        method: 'DELETE',
        url: intygsUrl,
        }).then((resp) =>{
            expect(resp.status).to.equal(200);
    });

}
Cypress.Commands.add("taBortIntyg", fx => {
    taBortIntyg(fx);

});

Cypress.Commands.add("rensaIntyg", fx => {
    rensaIntyg(fx);

});
Cypress.Commands.add("loggaInVårdpersonalNormal", (vårdpersonal, vårdenhet) => {
    loggaInVårdpersonal(vårdpersonal, vårdenhet, false);
});

Cypress.Commands.add("loggaInVårdpersonalIntegrerat", (vårdpersonal, vårdenhet, intygsId) => {
    loggaInVårdpersonal(vårdpersonal, vårdenhet,  intygsId, true,);
});
