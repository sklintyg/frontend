import {
  fakeBooleanFilter,
  fakeDateFilter,
  fakeDateRangeFilter,
  fakeListConfig,
  fakeOrderFilter,
  fakePageSizeFilter,
  fakePersonIdFilter,
  fakeSelectFilter,
} from '../../../src/faker'
import { CertificateListItemValueType } from '../../../src/types'

export const question = fakeListConfig({
  filters: [
    fakeSelectFilter({
      id: 'UNIT',
      title: 'Enhet',
      alwaysHighlighted: false,
      description: '',
      values: [
        {
          id: '',
          name: 'Visa alla (0)',
          defaultValue: true,
        },
        {
          id: 'TSTNMT2321000156-ALMC',
          name: 'Alfa Medicincentrum (0)',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-10AM',
          name: '&emsp; Alfa Allergimottagningen (0)',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-ALHM',
          name: '&emsp; Alfa Hudmottagningen (0)',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-ALIM',
          name: '&emsp; Alfa Infektionsmottagningen (0)',
          defaultValue: false,
        },
      ],
    }),
    fakeSelectFilter({
      id: 'FORWARDED',
      title: 'Vidarebefordrat',
      alwaysHighlighted: false,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: true,
        },
        {
          id: 'FORWARDED',
          name: 'Vidarebefordrade',
          defaultValue: false,
        },
        {
          id: 'NOT_FORWARDED',
          name: 'Ej vidarebefordrade',
          defaultValue: false,
        },
      ],
    }),
    fakeSelectFilter({
      id: 'STATUS',
      title: 'Åtgärd',
      alwaysHighlighted: false,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: false,
        },
        {
          id: 'NOT_HANDLED',
          name: 'Alla ej hanterade',
          defaultValue: true,
        },
        {
          id: 'HANDLED',
          name: 'Alla hanterade',
          defaultValue: false,
        },
        {
          id: 'COMPLEMENT',
          name: 'Komplettera',
          defaultValue: false,
        },
        {
          id: 'ANSWER',
          name: 'Svara',
          defaultValue: false,
        },
        {
          id: 'READ_ANSWER',
          name: 'Läs inkommet svar',
          defaultValue: false,
        },
        {
          id: 'WAIT',
          name: 'Invänta svar',
          defaultValue: false,
        },
      ],
    }),
    fakeSelectFilter({
      id: 'SENDER',
      title: 'Avsändare',
      alwaysHighlighted: false,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: true,
        },
        {
          id: 'FK',
          name: 'Försäkringskassan',
          defaultValue: false,
        },
        {
          id: 'WC',
          name: 'Vårdenheten',
          defaultValue: false,
        },
      ],
    }),
    fakeSelectFilter({
      id: 'SIGNED_BY',
      title: 'Signerat av',
      alwaysHighlighted: true,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: true,
        },
      ],
    }),
    fakePersonIdFilter({
      id: 'PATIENT_ID',
      title: 'Patient',
      alwaysHighlighted: false,
      description: '',
      placeholder: 'åååå-mm-dd',
    }),
    fakeDateRangeFilter({
      id: 'SENT',
      title: 'Skickat datum',
      alwaysHighlighted: false,
      description: '',
      to: fakeDateFilter({
        id: 'TO',
        title: 'till',
        alwaysHighlighted: false,
        description: '',
      }),
      from: fakeDateFilter({
        id: 'FROM',
        title: 'Från',
        alwaysHighlighted: false,
        description: '',
      }),
      forbidFutureDates: true,
    }),
    fakeOrderFilter({
      id: 'ORDER_BY',
      title: '',
      alwaysHighlighted: false,
      description: '',
      defaultValue: 'SENT_RECEIVED',
    }),
    fakeBooleanFilter({
      id: 'ASCENDING',
      title: '',
      alwaysHighlighted: false,
      description: '',
      defaultValue: false,
    }),
    fakePageSizeFilter({
      id: 'PAGESIZE',
      title: 'Visa antal träffar',
      alwaysHighlighted: false,
      description: '',
      pageSizes: [10, 25, 50, 100],
    }),
  ],
  title: 'Ej hanterade ärenden',
  description: 'Nedan visas ej hanterade ärenden, kompletteringsbegäran och administrativa frågor, för den eller de enheter du väljer.',
  emptyListText: 'Det finns inga ohanterade ärenden för den enhet eller de enheter du är inloggad på.',
  secondaryTitle: 'Ärenden visas för alla enheter',
  buttonTooltips: {
    RESET_BUTTON: 'Återställ sökfilter för ej hanterade ärenden.',
    OPEN_BUTTON: 'Öppnar intyget och frågan/svaret.',
    SEARCH_BUTTON: 'Sök efter frågor och svar.',
  },
  excludeFilterButtons: false,
  tableHeadings: [
    {
      id: 'QUESTION_ACTION',
      title: 'Åtgärd',
      type: CertificateListItemValueType.TEXT,
      description: 'Åtgärd som krävs för att frågan/ärendet ska anses hanterad.',
      defaultAscending: true,
    },
    {
      id: 'SENDER',
      title: 'Avsändare',
      type: CertificateListItemValueType.TEXT,
      description: 'Vem som initierade frågan.',
      defaultAscending: true,
    },
    {
      id: 'PATIENT_ID',
      title: 'Patient',
      type: CertificateListItemValueType.PATIENT_INFO,
      description: 'Patientens personnummer.',
      defaultAscending: true,
    },
    {
      id: 'SIGNED_BY',
      title: 'Signerat av',
      type: CertificateListItemValueType.TEXT,
      description: 'Läkare som signerat intyget.',
      defaultAscending: true,
    },
    {
      id: 'SENT_RECEIVED',
      title: 'Skickat/mottaget',
      type: CertificateListItemValueType.DATE,
      description: 'Datum och klockslag för senaste händelse.',
      defaultAscending: false,
    },
    {
      id: 'FORWARDED',
      title: 'Vidarebefordrad',
      type: CertificateListItemValueType.FORWARD,
      description: 'Visar om ärendet är vidarebefordrat.',
      defaultAscending: true,
    },
    {
      id: 'FORWARD_CERTIFICATE',
      title: '',
      type: CertificateListItemValueType.FORWARD_BUTTON,
      description: '',
      defaultAscending: true,
    },
    {
      id: 'OPEN_CERTIFICATE',
      title: '',
      type: CertificateListItemValueType.OPEN_BUTTON,
      description: '',
      defaultAscending: true,
    },
  ],
  shouldUpdateConfigAfterListSearch: true,
})
