export const draft = {
  filters: [
    {
      type: 'SELECT',
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
    },
    {
      type: 'SELECT',
      id: 'STATUS',
      title: 'Utkast',
      alwaysHighlighted: false,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: true,
        },
        {
          id: 'INCOMPLETE',
          name: 'Uppgifter saknas',
          defaultValue: false,
        },
        {
          id: 'COMPLETE',
          name: 'Kan signeras',
          defaultValue: false,
        },
        {
          id: 'LOCKED',
          name: 'Låsta',
          defaultValue: false,
        },
      ],
    },
    {
      type: 'SELECT',
      id: 'SAVED_BY',
      title: 'Sparat av',
      alwaysHighlighted: true,
      description: '',
      values: [
        {
          id: 'SHOW_ALL',
          name: 'Visa alla',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-DRAA',
          name: 'Ajla Doktor',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-VAAA',
          name: 'Alva vårdadministratör',
          defaultValue: true,
        },
        {
          id: 'TSTNMT2321000156-1079',
          name: 'Arnold Johansson',
          defaultValue: false,
        },
        {
          id: 'TSTNMT2321000156-110B',
          name: 'Åke Lönnqvist',
          defaultValue: false,
        },
      ],
    },
    {
      type: 'PERSON_ID',
      id: 'PATIENT_ID',
      title: 'Patient',
      alwaysHighlighted: false,
      description: '',
      placeholder: 'åååå-mm-dd',
    },
    {
      type: 'DATE_RANGE',
      id: 'SAVED',
      title: 'Sparat datum',
      alwaysHighlighted: false,
      description: '',
      to: {
        type: 'DATE',
        id: 'TO',
        title: 'till',
        alwaysHighlighted: false,
        description: '',
      },
      from: {
        type: 'DATE',
        id: 'FROM',
        title: 'Från',
        alwaysHighlighted: false,
        description: '',
      },
      forbidFutureDates: true,
    },
    {
      type: 'ORDER',
      id: 'ORDER_BY',
      title: '',
      alwaysHighlighted: false,
      description: '',
      defaultValue: 'SAVED',
    },
    {
      type: 'BOOLEAN',
      id: 'ASCENDING',
      title: '',
      alwaysHighlighted: false,
      description: '',
      defaultValue: false,
    },
    {
      type: 'PAGESIZE',
      id: 'PAGESIZE',
      title: 'Visa antal träffar',
      alwaysHighlighted: false,
      description: '',
      pageSizes: [10, 25, 50, 100],
    },
  ],
  title: 'Ej signerade utkast',
  description: 'Nedan visas alla ej signerade utkast för den enhet du är inloggad på.',
  emptyListText: 'Det finns inga ej signerade utkast för den enhet du är inloggad på.',
  secondaryTitle: 'Intyg visas för Alfa Medicincentrum',
  buttonTooltips: {
    RESET_BUTTON: 'Återställ sökfilter för ej signerade utkast.',
    OPEN_BUTTON: 'Öppnar utkastet.',
    SEARCH_BUTTON: 'Sök efter utkast.',
  },
  excludeFilterButtons: false,
  tableHeadings: [
    {
      id: 'CERTIFICATE_TYPE_NAME',
      title: 'Typ av intyg',
      type: 'TEXT',
      description: 'Intygstyp',
      defaultAscending: true,
    },
    {
      id: 'STATUS',
      title: 'Status',
      type: 'TEXT',
      description:
        '<p>Visar utkastets status:<ul><li>Utkast, uppgifter saknas = utkastet är sparat, men obligatoriska uppgifter saknas.</li><li>Utkast, kan signeras = utkastet är komplett, sparat och kan signeras.</li><li>Utkast, låst = Utkastet är låst.</li></ul></p>',
      defaultAscending: true,
    },
    {
      id: 'SAVED',
      title: 'Senast sparat',
      type: 'DATE',
      description: 'Datum och klockslag då utkastet senast sparades.',
      defaultAscending: false,
    },
    {
      id: 'PATIENT_ID',
      title: 'Patient',
      type: 'PATIENT_INFO',
      description: 'Patientens personnummer.',
      defaultAscending: true,
    },
    {
      id: 'SAVED_BY',
      title: 'Sparat av',
      type: 'TEXT',
      description: 'Person som senast sparade utkastet.',
      defaultAscending: true,
    },
    {
      id: 'FORWARDED',
      title: 'Vidarebefordrad',
      type: 'FORWARD',
      description: 'Visar om utkastet är vidarebefordrat.',
      defaultAscending: true,
    },
    {
      id: 'FORWARD_CERTIFICATE',
      title: '',
      type: 'FORWARD_BUTTON',
      description: '',
      defaultAscending: true,
    },
    {
      id: 'OPEN_CERTIFICATE',
      title: '',
      type: 'OPEN_BUTTON',
      description: '',
      defaultAscending: true,
    },
  ],
  shouldUpdateConfigAfterListSearch: false,
}