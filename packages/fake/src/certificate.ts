import { faker } from '@faker-js/faker'

const certificates = [
  {
    id: 'af00213',
    label: 'Arbetsförmedlingens medicinska utlåtande',
    description: 'Arbetsförmedlingens medicinska utlåtande',
    detailedDescription:
      'Arbetsförmedlingen behöver ett medicinskt utlåtande för en arbetssökande som har ett behov av fördjupat stöd.\n\n        Vi behöver ett utlåtande för att kunna:\n\n        • utreda och bedöma om den arbetssökande har en funktionsnedsättning som medför nedsatt arbetsförmåga\n        • bedöma om vi behöver göra anpassningar i program eller insatser\n        • erbjuda lämpliga utredande, vägledande, rehabiliterande eller arbetsförberedande insatser.',
    issuerTypeId: 'AF00213',
    recipient: 'AF',
    deprecated: false,
  },
  {
    id: 'tstrk1009',
    label: 'Läkares anmälan till Transportstyrelsen',
    description: 'Läkares anmälan om medicinsk olämplighet att inneha körkort, körkortstillstånd, traktorkort eller taxiförarlegitimation',
    detailedDescription:
      'Transportstyrelsens läkares anmälan TSTRK1009 ska användas för läkares anmälan om medicinsk olämplighet att inneha körkortstillstånd, körkort, traktorkort eller taxiförarlegitimation.',
    issuerTypeId: 'TSTRK1009',
    recipient: 'TRANSP',
    deprecated: false,
  },
  {
    id: 'fk7263',
    label: 'Läkarintyg FK 7263',
    description: 'Läkarintyg enligt 3 kap, 8 § lagen (1962:381) om allmän försäkring',
    detailedDescription:
      'Läkarintyget används av Försäkringskassan för att bedöma om patienten har rätt till sjukpenning. Av intyget ska det framgå hur sjukdomen påverkar patientens arbetsförmåga och hur länge patienten behöver vara sjukskriven.',
    issuerTypeId: 'FK 7263',
    recipient: 'FKASSA',
    deprecated: true,
  },
  {
    id: 'af00251',
    label: 'Läkarintyg för deltagare i arbetsmarknadspolitiska program',
    description:
      'Läkarintyg för deltagare i arbetsmarknadspolitiska program med aktivitetsstöd, utvecklingsersättning eller etableringsersättning',
    detailedDescription:
      'Om en programdeltagare är sjuk i mer än 7 dagar behöver hen lämna läkarintyg till Arbetsförmedlingen för att styrka att hen är förhindrad att delta i programmet på grund av sjukdom.\n\n        Arbetsförmedlingen behöver få läkarintyget för att programdeltagaren ska kunna ha möjlighet att få ersättning under sjukfrånvaron.\n        Arbetsförmedlingen använder också informationen i läkarintyget för att utreda om det är möjligt att anpassa aktiviteter i programmet så att programdeltagaren kan delta trots sin sjukdom.',
    issuerTypeId: 'AF00251',
    recipient: 'AF',
    deprecated: false,
  },
  {
    id: 'lisjp',
    label: 'Läkarintyg för sjukpenning',
    description: 'Läkarintyg för sjukpenning',
    detailedDescription:
      'Vad är sjukpenning?\n        Sjukpenning är en ersättning för personer som arbetar i Sverige och har en nedsatt arbetsförmåga på grund av sjukdom. Beroende på hur mycket arbetsförmågan är nedsatt kan man få en fjärdedels, halv, tre fjärdedels eller hel sjukpenning.\n\n        Andra förmåner som detta läkarintyg används till\n        Om du stänger av patienten enligt smittskyddslagen ska du även använda detta intyg\n    ',
    issuerTypeId: 'FK 7804',
    recipient: 'FKASSA',
    deprecated: false,
  },
  {
    id: 'ag7804',
    label: 'Läkarintyg om arbetsförmåga – arbetsgivaren',
    description: 'Läkarintyg om arbetsförmåga – arbetsgivaren',
    detailedDescription:
      '<p>Läkarintyg om arbetsförmåga – arbetsgivaren skapas från Försäkringskassans läkarintyg för sjukpenning (FK 7804) och används i följande situationer:</p><ul><li>När patienten har en anställning och behöver ett läkarintyg i förhållande till sin arbetsgivare.</li><li>När patienten varit frånvarande från arbetet i fler än 14 dagar.</li><li>När intygsutfärdande läkaren bedömer att patienten behöver vara sjukfrånvarande längre tid än 14 dagar och att sjukfrånvaron därmed kommer att överstiga sjuklöneperioden. <i>Läkarintyg om arbetsförmåga – arbetsgivaren</i> kan utfärdas för att undvika ett återbesök efter dag 14 och fyller då funktionen som intyg till arbetsgivare både <i>under</i> sjuklöneperioden och <i>efter</i> sjuklöneperioden.</li></ul>\n\t',
    issuerTypeId: 'AG7804',
    recipient: '',
    deprecated: false,
  },
  {
    id: 'ag114',
    label: 'Läkarintyg om arbetsförmåga – sjuklöneperioden',
    description: 'Läkarintyg om arbetsförmåga – sjuklöneperioden',
    detailedDescription:
      'Läkarintyg om arbetsförmåga – sjuklöneperioden ska användas när patienten har en anställning och behöver ett läkarintyg i förhållande till sin arbetsgivare. Intyget används under sjuklöneperioden, det vill säga under de 14 första dagarna i sjukfallet.',
    issuerTypeId: 'AG1-14',
    recipient: '',
    deprecated: false,
  },
  {
    id: 'luae_fs',
    label: 'Läkarutlåtande för aktivitetsersättning vid förlängd skolgång',
    description: 'Läkarutlåtande för aktivitetsersättning vid förlängd skolgång',
    detailedDescription:
      'Vad är aktivitetsersättning vid förlängd skolgång?\nAktivitetsersättning vid förlängd skolgång är en ersättning för unga personer, som på grund av funktionsnedsättning måste förlänga sin skolgång för att slutföra grundskola eller gymnasium. Det är möjligt att ansöka om ersättning även om studietiden är kortare än ett år. Man kan få ersättningen från juli månad det år man fyller 19 år fram till och med månaden innan man fyller 30 år. Ersättningen betalas alltid ut som hel ersättning, även om studierna till följd av funktionsnedsättningen måste bedrivas på deltid.',
    issuerTypeId: 'FK 7802',
    recipient: 'FKASSA',
    deprecated: false,
  },
  {
    id: 'luae_na',
    label: 'Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga',
    description: 'Läkarintyg enligt 3 kap, 8 § lagen (1962:381) om allmän försäkring',
    detailedDescription:
      'Vad är aktivitetsersättning vid nedsatt arbetsförmåga?\nAktivitetsersättning vid nedsatt arbetsförmåga är en tidsbegränsad ersättning för unga personer som har nedsatt arbetsförmåga på grund av sjukdom, skada eller funktionsnedsättning.',
    issuerTypeId: 'FK 7801',
    recipient: 'FKASSA',
    deprecated: false,
  },
  {
    id: 'luse',
    label: 'Läkarutlåtande för sjukersättning',
    description: 'Läkarintyg enligt 3 kap, 8 § lagen (1962:381) om allmän försäkring',
    detailedDescription:
      'Vad är sjukersättning?\nSjukersättning är en ersättning för personer som har en stadigvarande nedsatt arbetsförmåga på grund av sjukdom, skada eller funktionsnedsättning. Man kan få sjukersättning om Försäkringskassan bedömer att arbetsförmågan är nedsatt med minst en fjärdedel för all överskådlig framtid och att alla rehabiliteringsmöjligheter bedöms uttömda.',
    issuerTypeId: 'FK 7800',
    recipient: 'FKASSA',
    deprecated: false,
  },
  {
    id: 'tstrk1062',
    label: 'Transportstyrelsens läkarintyg ADHD',
    description: 'Läkarintyg avseende ADHD, autismspektrumtillstånd och likartade tillstånd samt psykisk utvecklingsstörning',
    detailedDescription:
      'Läkarintyg avseende ADHD, autismspektrumtillstånd och likartade tillstånd samt psykisk utvecklingsstörning TSTRK1062. ',
    issuerTypeId: 'TSTRK1062',
    recipient: 'TRANSP',
    deprecated: false,
  },
  {
    id: 'ts-diabetes',
    label: 'Transportstyrelsens läkarintyg diabetes',
    description: 'Läkarintyg diabetes avseende lämpligheten att inneha körkort m.m.',
    detailedDescription:
      'Transportstyrelsens läkarintyg diabetes ska användas vid diabetessjukdom. Föreskrivna krav på läkarens specialistkompetens vid diabetessjukdom framgår av 17 kap. i Transportstyrelsens föreskrifter (TSFS 2010:125) och allmänna råd om medicinska krav för innehav av körkort m.m.\n\t',
    issuerTypeId: 'TSTRK1031',
    recipient: 'TRANSP',
    deprecated: false,
  },
  {
    id: 'ts-bas',
    label: 'Transportstyrelsens läkarintyg högre körkortsbehörighet',
    description: 'Läkarintyg - avseende högre körkortsbehörigheter eller taxiförarlegitimation - på begäran av Transportstyrelsen',
    detailedDescription:
      'Transportstyrelsens läkarintyg ska användas vid förlängd giltighet av högre behörighet från 45 år, ansökan om körkortstillstånd för grupp II och III och vid ansökan om taxiförarlegitimation. Transportstyrelsens läkarintyg kan även användas när Transportstyrelsen i annat fall begärt ett allmänt läkarintyg avseende lämplighet att inneha körkort.\n\nSpecialistintyg finns bl.a. för alkohol, läkemedel, synfunktion, Alkolås m.m. Se <LINK:transportstyrelsen>.',
    issuerTypeId: 'TSTRK1007',
    recipient: 'TRANSP',
    deprecated: false,
  },
]

export const fakeCertificate = (includeDeprecated = false) =>
  faker.helpers.arrayElement(certificates.filter(({ deprecated }) => !includeDeprecated && deprecated === false))

export const {
  fakeCertificateId,
  fakeCertificateLabel,
  fakeCertificateDescription,
  fakeCertificateDetailedDescription,
  fakeCertificateIssuerTypeId,
  fakeCertificateRecipient,
} = {
  fakeCertificateId: (includeDeprecated = false) => fakeCertificate(includeDeprecated).id,
  fakeCertificateLabel: (includeDeprecated = false) => fakeCertificate(includeDeprecated).label,
  fakeCertificateDescription: (includeDeprecated = false) => fakeCertificate(includeDeprecated).description,
  fakeCertificateDetailedDescription: (includeDeprecated = false) => fakeCertificate(includeDeprecated).detailedDescription,
  fakeCertificateIssuerTypeId: (includeDeprecated = false) => fakeCertificate(includeDeprecated).issuerTypeId,
  fakeCertificateRecipient: (includeDeprecated = false) => fakeCertificate(includeDeprecated).recipient,
}
