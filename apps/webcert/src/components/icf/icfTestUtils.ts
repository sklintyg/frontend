import { fakeCertificateConfig, fakeDiagnosesElement } from '../../faker'
import { IcfState } from '../../store/icf/icfReducer'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigTypes,
  Icd10Code,
  IcfCode,
  ResourceLinkType,
} from '../../types'

export const getIcfData = (): IcfState => {
  const commonIcfCodes: IcfCode[] = [
    {
      code: '0',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '1',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '2',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const uniqueIcfCodes: IcfCode[] = [
    {
      code: '3',
      description: 'description 3',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 3',
    },
    {
      code: '4',
      description: 'description 4',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 4',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: Icd10Code[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes: commonIcfCodes, icd10Codes: icdCodes },
      uniqueCodes: [{ icfCodes: uniqueIcfCodes, icd10Codes: [ICD_CODE_1] }],
    },
    disability: {
      commonCodes: { icfCodes: commonIcfCodes, icd10Codes: icdCodes },
      uniqueCodes: [{ icfCodes: uniqueIcfCodes, icd10Codes: [ICD_CODE_1] }],
    },
    functionDisablers: [],
    originalIcd10Codes: [],
  }
}

export const getCertificateWithDiagnosisElementWithCodeSystem = (codeSystem: string): Certificate => {
  return {
    links: [
      {
        type: ResourceLinkType.FMB,
        enabled: true,
        name: 'FMB',
        description: 'FMB',
      },
    ],
    data: {
      '6.1': getDiagnosisElementWithCodeSystem(codeSystem),
    },
    metadata: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      patient: {
        personId: {
          type: 'type',
          id: '1912121212',
        },
      },
    },
  }
}

export const getDiagnosisElementWithCodeSystem = (codeSystem: string): CertificateDataElement =>
  fakeDiagnosesElement({
    id: '6.1',
    parent: '6',
    index: 6,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
    },
    value: {
      list: [
        {
          code: 'code',
          terminology: codeSystem,
          id: '1',
        },
      ],
    },
  })['6.1']

export const getCodeElement = (): CertificateDataElement => {
  return {
    id: '6.1',
    parent: '6',
    index: 6,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: fakeCertificateConfig.diagnoses({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_DIAGNOSES,
    }),
    value: {
      type: CertificateDataValueType.CODE,
      code: 'code',
      id: 'id',
    },
    validation: [],
    validationErrors: [],
  }
}
