import faker from 'faker'
import { Merge, PartialDeep } from 'type-fest'
import {
  CertificateData,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  ConfigCategory,
  ConfigTypes,
  ConfigUeCheckboxBoolean,
  ConfigUeCheckboxMultipleCodes,
  ConfigUeCheckboxMultipleDate,
  ConfigUeDate,
  ConfigUeDiagnoses,
  ConfigUeDropdown,
  ConfigUeHeader,
  ConfigUeIcf,
  ConfigUeRadioBoolean,
  ConfigUeRadioMultipleCodes,
  ConfigUeTextArea,
  ConfigUeTextField,
  ConfigUeTypeahead,
  ConfigureUeCauseOfDeath,
  ConfigureUeCauseOfDeathList,
  ConfigureUeUncertainDate,
  Value,
  ValueBoolean,
  ValueCauseOfDeath,
  ValueCauseOfDeathList,
  ValueCode,
  ValueCodeList,
  ValueDate,
  ValueDateList,
  ValueDiagnosis,
  ValueHeader,
  ValueIcf,
  ValueText,
  ValueUncertainDate,
} from '../../types/certificate'
import { fakeCertificateDataValidation, fakeCertificateValidationError } from './fakeCertificateDataValidation'
import { fakeList } from './fakeList'

type PartialCertificateDataElement<T, P> = PartialDeep<Merge<CertificateDataElement, { config: T; value: P }>>

export const fakeCertificateData = (children: CertificateData[]): CertificateData => {
  return children.reduce(
    (product: CertificateData, elements) =>
      Object.values(elements).reduce((result, element) => {
        return {
          ...result,
          ...fakeDataElement({ ...element, index: Object.keys(result).length + 1 }),
        }
      }, product),
    {}
  )
}

export const fakeDataElement = (data?: PartialDeep<CertificateDataElement>, children: CertificateData[] = []): CertificateData => {
  const type = data?.config?.type ?? ConfigTypes.CATEGORY
  const id = data?.id ?? faker.random.alpha({ count: 5 })
  let certificateData: CertificateData = {}
  certificateData[id] = {
    parent: '',
    index: 0,
    visible: true,
    readOnly: false,
    mandatory: false,
    ...data,
    validation: data?.validation instanceof Array ? data?.validation.map(fakeCertificateDataValidation) : [],
    validationErrors: data?.validationErrors instanceof Array ? data.validationErrors.map(fakeCertificateValidationError) : [],
    id,
    config: {
      type: ConfigTypes.CATEGORY,
      text: `${id} - ${faker.lorem.words()}`,
      description: data?.config?.description ?? type === ConfigTypes.CATEGORY ? `description: ${faker.lorem.sentence()}` : '',
      ...data?.config,
      id,
    },
    value:
      data != null && data.value != null
        ? {
            ...data.value,
            type: data?.value?.type ?? CertificateDataValueType.UNKNOWN,
          }
        : null,
  }

  children.forEach((elements, indexOffset) => {
    certificateData = Object.values(elements).reduce((certificateData: CertificateData, element, index) => {
      return { ...certificateData, ...fakeDataElement({ ...element, parent: id, id: element.id ?? `${id}.${indexOffset + index + 1}` }) }
    }, certificateData)
  })

  return certificateData
}

export const fakeCategoryElement = (
  data?: PartialCertificateDataElement<ConfigCategory, Value>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.CATEGORY,
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.UNKNOWN,
        ...data?.value,
      },
    },
    children
  )

export const fakeCheckboxBooleanElement = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxBoolean, ValueCodeList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
        label: faker.lorem.sentence(),
        text: 'text',
        description: 'description',
        selectedText: 'Ja',
        unselectedText: 'Nej',
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.BOOLEAN,
        id: faker.random.alpha({ count: 10 }),
        ...data?.value,
      },
    },
    children
  )

export const fakeCheckboxMultipleCodeElement = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxMultipleCodes, ValueCodeList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
        label: faker.lorem.sentence(),
        text: `text: ${faker.lorem.sentence()}`,
        selectedText: 'Ja',
        unselectedText: 'Nej',
        list: fakeList(5),
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.CODE_LIST,
        id: faker.random.alpha({ count: 10 }),
        list: [],
        ...data?.value,
      },
    },
    children
  )

export const fakeDiagnosesElement = (
  data?: PartialCertificateDataElement<ConfigUeDiagnoses, ValueDiagnosis>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_DIAGNOSES,
        text: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        terminology: [
          {
            id: 'ICD_10_SE',
            label: 'ICD-10-SE',
          },
          {
            id: 'KSH_97_P',
            label: 'KSH97-P (Primärvård)',
          },
        ],
        list: fakeList(3),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DIAGNOSIS_LIST, list: [], ...data?.value },
    },
    children
  )

export const fakeICFDataElement = (
  data?: PartialCertificateDataElement<ConfigUeIcf, ValueIcf>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_ICF,
        header: `header: ${faker.lorem.sentence()}`,
        modalLabel: `modalLabel: ${faker.lorem.sentence()}`,
        collectionsLabel: `collectionsLabel: ${faker.lorem.sentence()}`,
        placeholder: `placeholder: ${faker.lorem.sentence()}`,
        ...data?.config,
      },
      value: { id: faker.random.alpha(), type: CertificateDataValueType.ICF, icfCodes: [], ...data?.value },
    },
    children
  )

export const fakeCheckboxMultipleDate = (
  data?: PartialCertificateDataElement<ConfigUeCheckboxMultipleDate, ValueDateList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
        list: fakeList(5),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DATE_LIST, list: [], ...data?.value },
    },
    children
  )

export const fakeRadioMultipleCodeElement = (
  data?: PartialCertificateDataElement<ConfigUeRadioMultipleCodes, ValueCode>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
        list: fakeList(5),
        ...data?.config,
      },
      value: { type: CertificateDataValueType.CODE, list: [], ...data?.value },
    },
    children
  )

export const fakeRadioBooleanElement = (
  data?: PartialCertificateDataElement<ConfigUeRadioBoolean, ValueBoolean>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_RADIO_BOOLEAN,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.BOOLEAN, selected: true, ...data?.value },
    },
    children
  )

export const fakeTextAreaElement = (
  data?: PartialCertificateDataElement<ConfigUeTextArea, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TEXTAREA,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Text', limit: 50, ...data?.value },
    },
    children
  )

export const fakeTextFieldElement = (
  data?: PartialCertificateDataElement<ConfigUeTextField, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TEXTFIELD,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.TEXT, text: 'Text', ...data?.value },
    },
    children
  )

export const fakeDropdownElement = (
  data?: PartialCertificateDataElement<ConfigUeDropdown, ValueCode>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        list: fakeList(5),
        ...data?.config,
      },
      value: {
        id: faker.random.alpha(),
        code: 'test',
        ...data?.value,
      },
    },
    children
  )

export const fakeTypeaheadElement = (
  data?: PartialCertificateDataElement<ConfigUeTypeahead, ValueText>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_TYPE_AHEAD,
        typeAhead: [
          'STOCKHOLM',
          'NACKA',
          'SOLNA',
          'LIDINGÖ',
          'HUDDINGE',
          'ÖSTERÅKER',
          'VÄRMDÖ',
          'HANINGE',
          'VAXHOLM',
          'TYRESÖ',
          'NYNÄSHAMN',
          'BOTKYRKA',
          'SALEM',
          'SÖDERTÄLJE',
          'NYKVARN',
          'STRÄNGNÄS',
          'GNESTA',
          'JÄRFÄLLA',
          'SOLLENTUNA',
          'SUNDBYBERG',
          'EKERÖ',
          'DANDERYD',
          'TÄBY',
          'VALLENTUNA',
          'NORRTÄLJE',
          'SIGTUNA',
          'UPPLANDS VÄSBY',
          'KNIVSTA',
          'UPPLANDS-BRO',
          'HÅBO',
          'MALMÖ',
          'BURLÖV',
          'LUND',
          'STAFFANSTORP',
          'LOMMA',
          'ESLÖV',
          'SVEDALA',
          'TRELLEBORG',
          'VELLINGE',
          'HÖÖR',
          'SVALÖV',
          'KLIPPAN',
          'HÖRBY',
          'KRISTIANSTAD',
          'SJÖBO',
          'HÄSSLEHOLM',
          'KÄVLINGE',
          'HELSINGBORG',
          'LANDSKRONA',
          'BJUV',
          'ÄNGELHOLM',
          'HÖGANÄS',
          'ÖRKELLJUNGA',
          'ÅSTORP',
          'PERSTORP',
          'BÅSTAD',
          'LAHOLM',
          'YSTAD',
          'TOMELILLA',
          'SKURUP',
          'SIMRISHAMN',
          'OSBY',
          'ÖSTRA GÖINGE',
          'MARKARYD',
          'ÄLMHULT',
          'LJUNGBY',
          'BROMÖLLA',
          'OLOFSTRÖM',
          'KARLSHAMN',
          'SÖLVESBORG',
          'HALMSTAD',
          'FALKENBERG',
          'GISLAVED',
          'SVENLJUNGA',
          'VARBERG',
          'HYLTE',
          'VÄRNAMO',
          'GNOSJÖ',
          'ALVESTA',
          'VAGGERYD',
          'TRANEMO',
          'VÄXJÖ',
          'TINGSRYD',
          'EMMABODA',
          'NYBRO',
          'KALMAR',
          'RONNEBY',
          'UPPVIDINGE',
          'SÄVSJÖ',
          'VETLANDA',
          'LESSEBO',
          'KARLSKRONA',
          'TORSÅS',
          'HÖGSBY',
          'MÖNSTERÅS',
          'OSKARSHAMN',
          'MÖRBYLÅNGA',
          'BORGHOLM',
          'GÖTEBORG',
          'MÖLNDAL',
          'LERUM',
          'KUNGSBACKA',
          'HÄRRYDA',
          'PARTILLE',
          'MARK',
          'BORÅS',
          'BOLLEBYGD',
          'ALINGSÅS',
          'ALE',
          'TROLLHÄTTAN',
          'ESSUNGA',
          'LILLA EDET',
          'VÅRGÅRDA',
          'KUNGÄLV',
          'STENUNGSUND',
          'UDDEVALLA',
          'HERRLJUNGA',
          'LYSEKIL',
          'FÄRGELANDA',
          'VÄNERSBORG',
          'MUNKEDAL',
          'STRÖMSTAD',
          'TANUM',
          'DALS-ED',
          'SOTENÄS',
          'BENGTSFORS',
          'GRÄSTORP',
          'MELLERUD',
          'ÅMÅL',
          'VARA',
          'LIDKÖPING',
          'TJÖRN',
          'ORUST',
          'ÖCKERÖ',
          'ULRICEHAMN',
          'FALKÖPING',
          'TIDAHOLM',
          'SKÖVDE',
          'MULLSJÖ',
          'HJO',
          'GÖTENE',
          'SKARA',
          'TIBRO',
          'MARIESTAD',
          'GULLSPÅNG',
          'TÖREBODA',
          'KARLSBORG',
          'HABO',
          'KRISTINEHAMN',
          'LAXÅ',
          'JÖNKÖPING',
          'ANEBY',
          'TRANÅS',
          'NÄSSJÖ',
          'EKSJÖ',
          'VÄSTERVIK',
          'HULTSFRED',
          'YDRE',
          'BOXHOLM',
          'KINDA',
          'ÖDESHÖG',
          'VIMMERBY',
          'LINKÖPING',
          'MJÖLBY',
          'NORRKÖPING',
          'FINSPÅNG',
          'MOTALA',
          'ÅTVIDABERG',
          'SÖDERKÖPING',
          'ASKERSUND',
          'VADSTENA',
          'VALDEMARSVIK',
          'NYKÖPING',
          'FLEN',
          'OXELÖSUND',
          'KATRINEHOLM',
          'TROSA',
          'HALLSBERG',
          'GOTLAND',
          'ESKILSTUNA',
          'KUNGSÖR',
          'VÄSTERÅS',
          'VINGÅKER',
          'ÖREBRO',
          'ENKÖPING',
          'KARLSTAD',
          'HAMMARÖ',
          'FILIPSTAD',
          'FORSHAGA',
          'SÄFFLE',
          'GRUMS',
          'KIL',
          'SUNNE',
          'ÅRJÄNG',
          'ARVIKA',
          'EDA',
          'TORSBY',
          'HAGFORS',
          'MALUNG-SÄLEN',
          'STORFORS',
          'MUNKFORS',
          'KARLSKOGA',
          'HÄLLEFORS',
          'NORA',
          'DEGERFORS',
          'LEKEBERG',
          'KUMLA',
          'LINDESBERG',
          'LJUSNARSBERG',
          'SALA',
          'KÖPING',
          'SKINNSKATTEBERG',
          'HALLSTAHAMMAR',
          'SURAHAMMAR',
          'ARBOGA',
          'NORBERG',
          'HEBY',
          'FAGERSTA',
          'SMEDJEBACKEN',
          'UPPSALA',
          'ÖSTHAMMAR',
          'TIERP',
          'LUDVIKA',
          'VANSBRO',
          'GAGNEF',
          'AVESTA',
          'SANDVIKEN',
          'HEDEMORA',
          'SÄTER',
          'ÄLVDALEN',
          'BORLÄNGE',
          'FALUN',
          'LEKSAND',
          'RÄTTVIK',
          'OVANÅKER',
          'MORA',
          'ORSA',
          'LJUSDAL',
          'HÄRJEDALEN',
          'GÄVLE',
          'OCKELBO',
          'HOFORS',
          'ÄLVKARLEBY',
          'BOLLNÄS',
          'SÖDERHAMN',
          'HUDIKSVALL',
          'NORDANSTIG',
          'ÖSTERSUND',
          'KROKOM',
          'BRÄCKE',
          'BERG',
          'STRÖMSUND',
          'DOROTEA',
          'SOLLEFTEÅ',
          'ÅRE',
          'ÅNGE',
          'SUNDSVALL',
          'RAGUNDA',
          'TIMRÅ',
          'HÄRNÖSAND',
          'KRAMFORS',
          'ÖRNSKÖLDSVIK',
          'ÅSELE',
          'UMEÅ',
          'NORDMALING',
          'VÄNNÄS',
          'VINDELN',
          'BJURHOLM',
          'VILHELMINA',
          'ROBERTSFORS',
          'SKELLEFTEÅ',
          'LYCKSELE',
          'NORSJÖ',
          'MALÅ',
          'SORSELE',
          'STORUMAN',
          'ARJEPLOG',
          'ARVIDSJAUR',
          'JOKKMOKK',
          'PITEÅ',
          'ÄLVSBYN',
          'BODEN',
          'LULEÅ',
          'KALIX',
          'HAPARANDA',
          'ÖVERTORNEÅ',
          'ÖVERKALIX',
          'PAJALA',
          'GÄLLIVARE',
          'KIRUNA',
        ],
        list: fakeList(3),
        ...data?.config,
        placeholder: 'Kommun',
      },
      value: { type: CertificateDataValueType.TEXT, text: '', list: [], ...data?.value },
    },
    children
  )

export const fakeUncertainDateElement = (
  data?: PartialCertificateDataElement<ConfigureUeUncertainDate, ValueUncertainDate>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_UNCERTAIN_DATE,
        allowedYears: [new Date().getFullYear() - 1, new Date().getFullYear()],
        unknownYear: true,
        unknownMonth: true,
        ...data?.config,
      },
      value: {
        id: faker.random.alpha(),
        value: '0000-00-00',
        ...data?.value,
      },
    },
    children
  )

export const fakeDateElement = (
  data?: PartialCertificateDataElement<ConfigUeDate, ValueDate>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_DATE,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.DATE, date: '2022-09-29', ...data?.value },
      validation: [
        fakeCertificateDataValidation({
          type: CertificateDataValidationType.MAX_DATE_VALIDATION,
          expression: data?.id ? `$${data.id.toUpperCase()}` : undefined,
          numberOfDays: 0,
        }),
        ...(data?.validation ?? []),
      ],
    },
    children
  )

export const fakeHeaderElement = (
  data?: PartialCertificateDataElement<ConfigUeHeader, ValueHeader>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_HEADER,
        ...data?.config,
      },
      value: { type: CertificateDataValueType.HEADER },
    },
    children
  )

export const fakeCauseOfDeathElement = (
  data?: PartialCertificateDataElement<ConfigureUeCauseOfDeath, ValueCauseOfDeath>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CAUSE_OF_DEATH,
        text: 'Den terminala dödsorsaken var',
        description: 'Den diagnos eller det tillstånd som ledde till den terminala dödsorsaken',
        label: 'A',
        causeOfDeath: {
          id: 'termainalDodsorsak',
          descriptionId: 'description',
          debutId: 'debut',
          specifications: [
            { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
            { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
            { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
          ],
        },
        ...data?.config,
      },
      value: {
        id: '1',
        description: {
          type: CertificateDataValueType.TEXT,
          id: 'description',
          text: 'Unguis incarnatus',
        },
        debut: {
          type: CertificateDataValueType.DATE,
          id: 'debut',
          date: '1960-04-23',
        },
        specification: {
          type: CertificateDataValueType.CODE,
          id: 'KRONISK',
          code: 'KRONISK',
        },
        ...data?.value,
        type: CertificateDataValueType.CAUSE_OF_DEATH,
      },
    },
    children
  )

export const fakeCauseOfDeathListElement = (
  data?: PartialCertificateDataElement<ConfigureUeCauseOfDeathList, ValueCauseOfDeathList>,
  children?: CertificateData[]
): CertificateData =>
  fakeDataElement(
    {
      ...data,
      config: {
        type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST,
        list: [
          {
            id: 'sjukdom1',
            descriptionId: 'description1',
            debutId: 'debut1',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom2',
            descriptionId: 'description2',
            debutId: 'debut2',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom3',
            descriptionId: 'description3',
            debutId: 'debut3',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom4',
            descriptionId: 'description4',
            debutId: 'debut4',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom5',
            descriptionId: 'description5',
            debutId: 'debut5',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom6',
            descriptionId: 'description6',
            debutId: 'debut6',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom7',
            descriptionId: 'description7',
            debutId: 'debut7',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
          {
            id: 'sjukdom8',
            descriptionId: 'description8',
            debutId: 'debut8',
            specifications: [
              { id: 'UPPGIFT_SAKNAS', code: 'UPPGIFT_SAKNAS', label: 'Uppgift saknas' },
              { id: 'KRONISK', code: 'KRONISK', label: 'Kronisk' },
              { id: 'PLOTSLIG', code: 'PLOTSLIG', label: 'Akut' },
            ],
          },
        ],
        ...data?.config,
      },
      value: {
        type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
        list: [
          {
            id: 'sjukdom1',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description1',
              text: 'Unguis incarnatus',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut1',
              date: '1960-04-23',
            },
            specification: {
              type: CertificateDataValueType.CODE,
              id: 'KRONISK',
              code: 'KRONISK',
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom2',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description2',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut2',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom3',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description3',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut3',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom4',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description4',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut4',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom5',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description5',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut5',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom6',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description6',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut6',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom7',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description7',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut7',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
          {
            id: 'sjukdom8',
            description: {
              type: CertificateDataValueType.TEXT,
              id: 'description8',
            },
            debut: {
              type: CertificateDataValueType.DATE,
              id: 'debut8',
            },
            specification: {
              type: CertificateDataValueType.CODE,
            },
            ...data?.value,
            type: CertificateDataValueType.CAUSE_OF_DEATH,
          },
        ],
      },
    },
    children
  )
