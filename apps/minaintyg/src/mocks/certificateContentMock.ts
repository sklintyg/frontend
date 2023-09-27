export const certificateContentMock = [
  {
    heading: 'Smittbärarpenning',
    body: `
      <h3>Avstängning enligt smittskyddslagen på grund av smitta</h3>
      <p>Ej angivet</p>
    `,
  },
  {
    heading: 'Grund för medicinskt underlag',
    body: `
      <h3>Intyget är baserat på</h3>
      <h4>Min undersökning av patienten</h4>
      <p>2023-02-07</p>
      <h4>Min telefonkontakt med patienten</h4>
      <p>Ej angivet</p>
      <h4>Journaluppgifter från den</h4>
      <p>Ej angivet</p>
      <h4>Ange vad annat är</h4>
      <p>Ej angivet</p>
    `,
  },
  {
    heading: 'Sysselsättning',
    body: `
      <h3>I relation till vilken sysselsättning bedömer du arbetsförmågan?</h3>
      <ul>
        <li>Nuvarande arbete</li>
      </ul>
      <h3>Ange yrke och arbetsuppgifter</h3>
      <p>Kontorsarbetare</p>

      <table>
        <thead>
          <tr>
            <th>Diagnoskod enligt ICD-10 SE</th>
            <th>Diagnos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S829</td>
            <td>Underbensfraktur med ospecificerad lokalisation</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    heading: 'Sjukdomens konsekvenser',
    body: `
      <h3>Funktionsnedsättning</h3>
      <h4>Beskriv undersökningsfynd, testresultat och observationer</h4>
      <p>Patienten har en underbensfraktur. Behandlas med helbensgrips och har därför nedsatt rörlighet i benet. Patienten
        får inte stödja på det skadade benet. Går långsamt och ostadigt med kryckor. Påtalar smärta vid undersökningen.
      </p>
      <h3>Aktivitetsbegränsning</h3>
      <h4>Beskriv vad patienten inte kan göra på grund av sin sjukdom. Ange vad uppgiften grundas
        på.</h4>
      <p>Patienten kan inte gå utan hjälpmedel. Klarar inte av att köra bil. Således mycket svårt att ta sig till arbetet.
        Dessutom problem med trappor på arbetsplatsen. Patienten kan även ha svårt att fokusera på sina arbetsuppgifter
        pga smärta.</p>
    `,
  },
  {
    heading: 'Medicinsk behandling',
    body: `
      <h3>Pågående medicinska behandlingar/åtgärder</h3>
      <h4>Ange vad syftet är och om möjligt tidplan samt ansvarig vårdenhet</h4>
      <p>Erhållit helbensgips, 0-belastning med kryckor. Smärtlindring.</p>
      <h3>Planerade medicinska behandlingar/åtgärder</h3>
      <h4>Ange vad syftet är och om möjligt tidplan samt ansvarig vårdenhet</h4>
      <p>Gips totalt 4 månader, initialt helbensgips. Rtg-kontroll efter 2, 4 och 6 veckor av frakturens läge. Om stabilt
        frakturläge vid 6 v kontroll byte till underbensgips. Rehabilitering efter avslutad gipsbehandling.</p>
    `,
  },
  {
    heading: 'Bedömning',
    body: `
      <h3>Min bedömning av patientens nedsättning av arbetsförmågan</h3>
      <table>
        <thead>
          <tr>
            <th>Nedsättningsgrad</th>
            <th>Från och med</th>
            <th>Till och med</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>100 procent</td>
            <td>2023-02-07</td>
            <td>2023-02-20</td>
          </tr>
        </tbody>
      </table>

      <h3>Patientens arbetsförmåga bedöms nedsatt längre tid än den som Socialstyrelsens
        försäkringsmedicinska beslutsstöd
        anger, därför att</h3>
      <p>Ej angivet</p>

      <h3>Kommer möjligheterna till återgång i arbete försämras om arbetstiden förläggs på annat
        sätt än att arbetstiden
        minskas lika mycket varje dag?</h3>
      <p>Ej angivet</p>

      <h3>Beskriv de medicinska skälen till att möjligheterna till återgång i arbete försämras</h3>
      <p>Ej angivet</p>

      <h3>Resor till och från arbetet med annat färdmedel än normalt kan göra det möjligt för
        patienten att återgå till
        arbetet under sjukskrivningsperioden.</h3>
      <p>Ej angivet</p>

      <h3>Prognos för arbetsförmåga utifrån aktuellt undersökningstillfälle</h3>
      <p>Patienten förväntas kunna återgå helt i nuvarande sysselsättning inom 1 månad.</p>
    `,
  },
  {
    heading: 'Åtgärder',
    body: `
      <h3>Här kan du ange åtgärder som du tror skulle göra det lättare för patienten att återgå i arbete</h3>
      <ul>
        <li>Arbetsanpassning</li>
      </ul>
      <h3>Här kan du ange fler åtgärder. Du kan också beskriva hur åtgärderna kan underlätta återgång i arbete.</h3>
      <p>Möjlighet till distansarbete i hemmet skulle underlätta mycket för patienten.</p>
    `,
  },
  {
    heading: 'Övriga upplysningar',
    body: `
      <h3>Övriga upplysningar</h3>
      <p>Ej angivet</p>
    `,
  },
  {
    heading: 'Kontakt',
    body: `
      <h3>Kontakt med Försäkringskassan</h3>
      <h4>Jag önskar att Försäkringskassan kontaktar mig</h4>
      <p>Ej angivet</p>
      <h4>Ange gärna varför du vill ha kontakt</h4>
      <p>Ej angivet</p>
    `,
  },
].map(({ heading, body }) => ({ heading, body: body.trim().replace(/\s+/g, ' ') }))
