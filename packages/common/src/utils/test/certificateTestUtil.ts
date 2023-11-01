import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigLayout,
  ConfigTypes,
  ValueDate,
} from '../../types/certificate'
import { Question, QuestionType } from '../../types/question'
import { ResourceLink } from '../../types/resourceLink'
import { fakeDateRangeElement } from '../faker'
import { fakeCertificateConfig } from '../faker/fakeCertificateConfig'
import { fakeCertificateValue } from '../faker/fakeCertificateValue'

export const getBooleanElement = (): CertificateDataElement => {
  return {
    id: '1.1',
    parent: 'funktionsnedsattning',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: fakeCertificateConfig.radioBoolean({
      text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      description: 'Med besvär avses sådant som påverkar psykiska, psykosociala eller kroppsliga funktioner.',
      id: 'harFunktionsnedsattning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    }),
    value: {
      type: CertificateDataValueType.BOOLEAN,
      id: 'harFunktionsnedsattning',
      selected: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.1',
        expression: 'exists($harFunktionsnedsattning)',
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
export const getDateElement = (): CertificateDataElement => {
  return {
    id: '1.1',
    parent: 'funktionsnedsattning',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: fakeCertificateConfig.date({
      text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      description: 'Med besvär avses sådant som påverkar psykiska, psykosociala eller kroppsliga funktioner.',
      id: 'dodsdatum',
    }),
    value: {
      type: CertificateDataValueType.DATE,
      id: 'dodsdatum',
      date: '2022-10-01',
    } as ValueDate,
    validation: [],
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
    config: fakeCertificateConfig.textArea({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      id: 'funktionsnedsattning',
    }),
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
      {
        type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
        questionId: '1.1',
        id: 'foobar',
        expression: '$harFunktionsnedsattning',
        fillValue: {
          type: CertificateDataValueType.TEXT,
          id: 'funktionsnedsattning',
          text: 'Detta är autoifyllt!',
        },
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
    config: fakeCertificateConfig.icf({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      id: 'funktionsnedsattning',
    }),
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
    config: fakeCertificateConfig.sickLeavePeriod({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_SICK_LEAVE_PERIOD,
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
    }),
    value: fakeCertificateValue.dateRangeList(),
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
export const getDateRangeElement = (): CertificateDataElement =>
  fakeDateRangeElement({
    id: '1.4',
    parent: '1.1',
    index: 1,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      type: ConfigTypes.UE_DATE_RANGE,
      text: 'text',
      description: 'description',
    },
    value: {
      type: CertificateDataValueType.DATE_RANGE,
      id: 'sjukskrivningsgradPeriod',
    },
    validation: [],
    validationErrors: [],
  })['1.4']

export const getAnotherTextElement = (): CertificateDataElement => {
  return {
    id: '1.3',
    parent: '1.1',
    index: 2,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: fakeCertificateConfig.textArea({
      text: 'En annan text',
      description: 'En annan beskrivning',
      id: 'annanFunktionsnedsattning',
    }),
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
      {
        type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
        questionId: '1.1',
        expression: '!$harFunktionsnedsattning',
        id: 'foobar',
        fillValue: {
          type: CertificateDataValueType.TEXT,
          id: 'annanFunktionsnedsattning',
          text: 'Detta skall inte autoifyllas eftersom villkoret är falskt!',
        },
      },
    ],
    validationErrors: [],
  }
}

export const getCheckBoxElement = (): CertificateDataElement => {
  return {
    id: '28',
    parent: 'sysselsattning',
    index: 7,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
      layout: ConfigLayout.COLUMN,
      text: 'I relation till vilken sysselsättning bedömer du arbetsförmågan?',
      description:
        'Om du kryssar i flera val är det viktigt att du tydliggör under "Övriga upplysningar" om sjukskrivningens omfattning eller period skiljer sig åt mellan olika sysselsättningar.',
      list: [
        {
          id: 'NUVARANDE_ARBETE',
          label: 'Nuvarande arbete',
        },
        {
          id: 'ARBETSSOKANDE',
          label: 'Arbetssökande - att utföra sådant arbete som är normalt förekommande på arbetsmarknaden',
        },
        {
          id: 'FORALDRALEDIG',
          label: 'Föräldraledighet för vård av barn',
        },
        {
          id: 'STUDIER',
          label: 'Studier',
        },
      ],
    },
    value: fakeCertificateValue.codeList({
      list: [
        {
          code: 'NUVARANDE_ARBETE',
          id: 'NUVARANDE_ARBETE',
        },
      ],
    }),
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '28',
        expression: '$NUVARANDE_ARBETE || $ARBETSSOKANDE || $FORALDRALEDIG || $STUDIER',
      },
      {
        type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
        questionId: '28',
        expression: '$NUVARANDE_ARBETE',
        id: ['ARBETSSOKANDE'],
      },
      {
        type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
        questionId: '28',
        expression: '$ARBETSSOKANDE',
        id: ['NUVARANDE_ARBETE'],
      },
    ],
    validationErrors: [],
  }
}

export const getCategoryFunktionsnedsattning = (): CertificateDataElement => {
  return {
    id: 'funktionsnedsattning',
    parent: '',
    index: 11,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Sjukdomens konsekvenser',
      description: 'En annan beskrivning',
      type: ConfigTypes.CATEGORY,
    },
    value: null,
    validation: [],
    validationErrors: [],
  }
}

export const getCategorySysselsattning = (): CertificateDataElement => {
  return {
    id: 'sysselsattning',
    parent: '',
    index: 6,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Sysselsättning',
      description: 'En annan beskrivning',
      type: ConfigTypes.CATEGORY,
    },
    value: null,
    validation: [],
    validationErrors: [],
  }
}

export const getCertificate = ({ links = [] }: { links?: ResourceLink[] } = {}): Certificate => {
  return {
    metadata: {
      id: 'certificateId',
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
        isInactive: false,
      },
      careUnit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
        isInactive: false,
      },
      unit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
        isInactive: false,
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
        personIdChanged: false,
        coordinationNumber: false,
        deceased: false,
        firstName: '',
        fullName: '',
        lastName: '',
        street: 'Street 1',
        zipCode: '12345',
        city: 'City',
        protectedPerson: false,
        testIndicated: false,
        reserveId: false,
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
      '28': getCheckBoxElement(),
      funktionsnedsattning: getCategoryFunktionsnedsattning(),
      sysselsattning: getCategorySysselsattning(),
    },
    links,
  }
}

export const getCertificateWithQuestion = (question: CertificateDataElement): Certificate => {
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
        isInactive: false,
      },
      careUnit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
        isInactive: false,
      },
      unit: {
        unitId: '',
        address: '',
        city: '',
        email: '',
        phoneNumber: '',
        zipCode: '',
        unitName: '',
        isInactive: false,
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
        personIdChanged: false,
        coordinationNumber: false,
        deceased: false,
        firstName: '',
        fullName: '',
        lastName: '',
        street: '',
        zipCode: '',
        city: '',
        protectedPerson: false,
        testIndicated: false,
        reserveId: false,
      },
      relations: {
        children: [],
        parent: null,
      },
      version: 1,
      typeVersion: '1.0',
    },
    data: {
      [question.id]: question,
    },
    links: [],
  }
}

export const getQuestions = (handled: boolean, type: QuestionType): Question[] => {
  return [{ type: type, handled: handled } as Question]
}
