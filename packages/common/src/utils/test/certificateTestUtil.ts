import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
} from '../../types/certificate'
import { Question, QuestionType } from '../../types/question'

export const getBooleanElement = (): CertificateDataElement => {
  return {
    id: '1.1',
    parent: 'funktionsnedsattning',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      description: 'Med besvär avses sådant som påverkar psykiska, psykosociala eller kroppsliga funktioner.',
      type: ConfigTypes.UE_RADIO_BOOLEAN,
      id: 'harFunktionsnedsattning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    },
    value: {
      type: CertificateDataValueType.BOOLEAN,
      id: 'harFunktionsnedsattning',
      selected: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
      {
        type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }
}

export const getTextElement = (): CertificateDataElement => {
  return {
    id: '1.2',
    parent: '1.1',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_TEXTAREA,
      id: 'funktionsnedsattning',
    },
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'funktionsnedsattning',
      text: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.2',
        expression: '$funktionsnedsattning',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }
}

export const getIcfElement = (): CertificateDataElement => {
  return {
    id: '1.2',
    parent: '1.1',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_ICF,
      id: 'funktionsnedsattning',
    },
    value: {
      type: CertificateDataValueType.ICF,
      id: 'funktionsnedsattning',
      text: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.2',
        expression: '$funktionsnedsattning',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }
}

export const getSickLeavePeriodElement = (): CertificateDataElement => {
  return {
    id: '1.4',
    parent: '1.1',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
      id: 'funktionsnedsattning',
      list: [
        {
          id: 'EN_FJARDEDEL',
          label: '25 procent',
        },
        {
          id: 'HALFTEN',
          label: '50 procent',
        },
        {
          id: 'TRE_FJARDEDEL',
          label: '75 procent',
        },
        {
          id: 'HELT_NEDSATT',
          label: '100 procent',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.DATE_RANGE_LIST,
      id: 'funktionsnedsattning',
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.4',
        expression: '$EN_FJARDEDEL || $HALFTEN || $TRE_FJARDEDEL || $HELT_NEDSATT',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }
}

export const getAnotherTextElement = (): CertificateDataElement => {
  return {
    id: '1.3',
    parent: '1.1',
    index: 2,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'En annan text',
      description: 'En annan beskrivning',
      type: ConfigTypes.UE_TEXTAREA,
      id: 'annanFunktionsnedsattning',
    },
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'annanFunktionsnedsattning',
      text: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.2',
        expression: '$funktionsnedsattning',
      },
      {
        type: CertificateDataValidationType.HIDE_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }
}

export const getCodeListElement = (): CertificateDataElement => {
  return {
    id: '1.4',
    parent: 'atgarder',
    index: 27,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Här kan du ange åtgärder som du tror skulle göra det lättare för patienten att återgå i arbete',
      description: '',
      type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
      list: [
        {
          id: 'EJ_AKTUELLT',
          label: 'Inte aktuellt',
        },
        {
          id: 'ARBETSTRANING',
          label: 'Arbetsträning',
        },
        {
          id: 'ARBETSANPASSNING',
          label: 'Arbetsanpassning',
        },
        {
          id: 'SOKA_NYTT_ARBETE',
          label: 'Söka nytt arbete',
        },
        {
          id: 'BESOK_ARBETSPLATS',
          label: 'Besök på arbetsplatsen',
        },
        {
          id: 'ERGONOMISK',
          label: 'Ergonomisk bedömning',
        },
        {
          id: 'HJALPMEDEL',
          label: 'Hjälpmedel',
        },
        {
          id: 'KONFLIKTHANTERING',
          label: 'Konflikthantering',
        },
        {
          id: 'KONTAKT_FHV',
          label: 'Kontakt med företagshälsovård',
        },
        {
          id: 'OMFORDELNING',
          label: 'Omfördelning av arbetsuppgifter',
        },
        {
          id: 'OVRIGA_ATGARDER',
          label: 'Övrigt',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.CODE_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '40',
        expression:
          '$EJ_AKTUELLT || $ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      },
      {
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression:
          '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
        id: ['EJ_AKTUELLT'],
      },
      {
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression: '$EJ_AKTUELLT',
        id: [
          'ARBETSTRANING',
          'ARBETSANPASSNING',
          'SOKA_NYTT_ARBETE',
          'BESOK_ARBETSPLATS',
          'ERGONOMISK',
          'HJALPMEDEL',
          'KONFLIKTHANTERING',
          'KONTAKT_FHV',
          'OMFORDELNING',
          'OVRIGA_ATGARDER',
        ],
      },
    ],
    validationErrors: [],
  }
}

export const getCertificate = (): Certificate => {
  return {
    metadata: {
      id: '',
      type: '',
      created: '',
      description: '',
      testCertificate: false,
      sent: false,
      latestMajorVersion: true,
      responsibleHospName: '',
      careProvider: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
      },
      careUnit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
      },
      unit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
      },
      forwarded: false,
      name: '',
      status: CertificateStatus.UNSIGNED,
      issuedBy: {
        personId: '',
        fullName: '',
        prescriptionCode: '',
      },
      patient: {
        personId: {
          id: '',
          type: '',
        },
        differentNameFromEHR: false,
        personIdUpdated: false,
        coordinationNumber: false,
        deceased: false,
        firstName: '',
        fullName: '',
        lastName: '',
        protectedPerson: false,
        testIndicated: false,
      },
      relations: {
        children: [],
        parent: null,
      },
      version: 1,
      typeVersion: '1.0',
    },
    data: {
      '1.1': getBooleanElement(),
      '1.2': getTextElement(),
      '1.3': getAnotherTextElement(),
      '1.4': getCodeListElement(),
    },
    links: [],
  }
}

export const getQuestions = (handled: boolean, type: QuestionType): Question[] => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return [{ type: type, handled: handled }]
}
