import { Icd10Code, IcfCode, IcfState } from '../../store/icf/icfReducer'

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
  }
}
