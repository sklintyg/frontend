import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
} from '../../types/certificate'

export const getBoooleanElement = (): CertificateDataElement => {
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
      careProvider: {
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
      '1.1': getBoooleanElement(),
      '1.2': getTextElement(),
      '1.3': getAnotherTextElement(),
    },
    links: [],
  }
}
