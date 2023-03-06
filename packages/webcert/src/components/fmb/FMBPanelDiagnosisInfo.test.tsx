import { FMBDiagnosisCodeInfo, FMBDiagnosisCodeInfoFormContentHeading, FMBDiagnosisCodeInfoFormType } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import FMBPanelDiagnosisInfo from './FMBPanelDiagnosisInfo'

const history = createMemoryHistory()

const renderDefaultComponent = (fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo, hasSeveralDiagnoses: boolean) => {
  render(
    <Router history={history}>
      <FMBPanelDiagnosisInfo fmbDiagnosisCodeInfo={fmbDiagnosisCodeInfo} hasSeveralDiagnoses={hasSeveralDiagnoses} />
    </Router>
  )
}

describe('FMBPanelDiagnosisInfo', () => {
  it('shall display message when diagnosis doesnt have FMB recommendations', async () => {
    renderDefaultComponent(emptyFMBDiagnosisCodeInfo, false)

    expect(screen.queryByText(/För den angivna diagnosen finns för tillfället inget FMB-stöd./i)).toBeInTheDocument()
  })

  it('shall display message when no diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(emptyFMBDiagnosisCodeInfo, true)

    expect(screen.queryByText(/För de angivna diagnoserna finns för tillfället inget FMB-stöd./i)).toBeInTheDocument()
  })

  it('shall display guidance information when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText(/Vid lindrig anorexia nervosa bör sjukskrivning undvikas./i)).toBeInTheDocument()
  })

  it('shall display diagnosis description when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText('Anorexia nervosa')).toBeInTheDocument()
  })

  it('shall display related diagnosis codes when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText(/F500, F501/i)).toBeInTheDocument()
  })

  it('shall display disability when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText(/Anorexia nervosa kan ge betydande kroppsliga funktionsnedsättningar/i)).toBeInTheDocument()
  })

  it('shall display activity limitations when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText(/Patienten har ofta en önskan att ha en högre aktivitetsgrad/i)).toBeInTheDocument()
  })

  it('shall display rehabilitation information when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.queryByText(/Det är bra om arbetsuppgifterna kan anpassas till fysiskt lättare/i)).toBeInTheDocument()
  })

  it('shall display fmb general information when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(
      screen.queryByText(/Det finns en spännvidd för hur en given sjukdom påverkar olika individers arbetsförmåga/i)
    ).toBeInTheDocument()
  })

  it('shall display symptom information when diagnosis have FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(
      screen.queryByText(/Anorexia nervosa \(med varianter\) är viljestyrd viktnedgång som vidmakthålls av en upplevelse/i)
    ).toBeInTheDocument()
  })

  it('shall display link where to get more information about the FMB recommendations', async () => {
    renderDefaultComponent(fmbDiagnosisCodeInfo, false)

    expect(screen.getByText('Information om Anorexia nervosa hos Socialstyrelsen').closest('a')).toHaveAttribute(
      'href',
      fmbDiagnosisCodeInfo.referenceLink
    )
  })
})

const fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo = {
  index: 0,
  icd10Code: 'F500',
  icd10Description: 'Anorexia nervosa',
  diagnosTitle: 'Anorexia nervosa',
  relatedDiagnoses: 'F500, F501',
  referenceDescription: 'Information om Anorexia nervosa hos Socialstyrelsen',
  referenceLink: 'https://roi.socialstyrelsen.se/fmb/anorexia-nervosa/549',
  forms: [
    {
      name: FMBDiagnosisCodeInfoFormType.FMB_DIAGNOSIS,
      content: [
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_GENERAL_INFO,
          text:
            '<p>Det finns en spännvidd för hur en given sjukdom påverkar olika individers arbetsförmåga och förmåga att utföra olika aktiviteter. Därför måste bedömningen av arbetsförmågan ske individuellt utifrån individens unika förutsättningar och sysselsättning.</p>\n<p>Vid anorexia nervosa saknas inte sällan sjukdomsinsikt. Patienten kan uttrycka önskemål om fortsatt arbete, trots betydande medicinska risker. Samsjuklighet med depression, ångest, tvångstankar, missbruk, personlighetsstörningar och neuropsykiatriska tillstånd är stor. Sjukskrivning i före-byggande syfte kan behövas när patienten genomgår medicinsk behandling som kräver daglig närvaro t.ex. dagvårdsbehandling.\nBarn med anorexia nervosa som inte kan gå i skolan kan periodvis behöva stöd av att en vuxen finns hemma.</p>\n',
        },
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_SYMPTOM_PROGNOSIS_TREATMENT,
          text:
            '<p>Anorexia nervosa (med varianter) är viljestyrd viktnedgång som vidmakthålls av en upplevelse av att vara för tjock (även vid utpräglad undervikt) och en rädsla för att gå upp i vikt. Tillståndet debuterar oftast i tonåren och är vanligast hos flickor och unga kvinnor (cirka tio procent är pojkar eller unga män). Ofta undviker patienten all form av fett. I sällsynta fall förekommer total matvägran. Intensiv motion, dagliga kräkningar och laxermedelsmissbruk är vanliga.\nAnorexia nervosa innebär betydande medicinska risker vid allvarlig svält framför allt i kombination med frekventa kräkningar. Allvarliga tillstånd på-verkar kroppens alla organ, särskilt hjärtat och cirkulationen, och kan vara livshotande. Överdödligheten är sex till nio gånger högre jämfört med nor-malbefolkningen i samma åldersgrupp. Tillståndet kan också övergå till andra former av ätstörningar.\nTidig upptäckt och snabbt insatt behandling är den viktigaste åtgärden för god prognos. Behandlingen är en kombination av nutritionsbehandling och psykopedagogiska eller psykoterapeutiska insatser. Behandlingen fokuserar på att patienten snabbt ska komma ur sin ätstörning, så att patienten inte blir långvarigt sjuk eller går ner mer i vikt. Medicinska kontroller av det kroppsliga hälsotillståndet är centralt eftersom patienten snabbt kan försämras. Samsjuklighet ska behandlas samtidigt med ätstörningen och kan kräva farmakologisk behandling.Anorexia nervosa kan vara långdraget och pågå med olika intensitet under fem till femton år. Hos vissa unga patienter som kommer till snabb behandling kan dock tillfrisknandet gå betydligt fortare, ett halvt till ett år. För de flesta patienter skiftar svårighetsgraden och symtomen under årens lopp.</p>\n',
        },
      ],
    },
    {
      name: FMBDiagnosisCodeInfoFormType.FMB_ACTIVITY_LIMITATION,
      content: [
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_ACTIVITY_LIMITATION,
          text:
            'Patienten har ofta en önskan att ha en högre aktivitetsgrad än vad läkaren tycker. Tillståndet påverkar förmågan att ta hand om sig själv och den sociala interaktionen med andra människor.',
        },
      ],
    },
    {
      name: FMBDiagnosisCodeInfoFormType.FMB_REHABILITATION_INFORMATION,
      content: [
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_REHABILITATION_INFORMATION,
          text:
            '<p>Det är bra om arbetsuppgifterna kan anpassas till fysiskt lättare arbete och med möjlighet att upprätthålla regelbundna matrutiner (frukost, lunch och middag).</p>\n',
        },
      ],
    },
    {
      name: FMBDiagnosisCodeInfoFormType.FMB_DISABILITY,
      content: [
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_DISABILITY,
          text:
            'Anorexia nervosa kan ge betydande kroppsliga funktionsnedsättningar, exempelvis problem med smärtor, ledbesvär, andfåddhet, trötthet och psykiska funktionsnedsättningar, exempelvis koncentrationssvårigheter, ångest, upptagenhet av mat (ej fokus på något annat).',
        },
      ],
    },
    {
      name: FMBDiagnosisCodeInfoFormType.FMB_WORK_CAPACITY,
      content: [
        {
          heading: FMBDiagnosisCodeInfoFormContentHeading.FMB_WORK_CAPACITY,
          list: [
            'Vid lindrig anorexia nervosa bör sjukskrivning undvikas.',
            'Vid medelsvår anorexia nervosa kan hel sjukskrivning, alternativt partiell sjukskrivning, upp till 6 månader behövas.',
            'Vid svår anorexia nervosa kan hel sjukskrivning, alternativt partiell sjukskrivning, upp till 12 månader behövas.',
            'Vid långvarig utpräglad undervikt och samsjuklighet kan arbetsförmågan bli permanent nedsatt',
          ],
        },
      ],
    },
  ],
}

const emptyFMBDiagnosisCodeInfo: FMBDiagnosisCodeInfo = {
  index: 0,
  icd10Code: 'A01',
  icd10Description: 'Tyfoid',
}
