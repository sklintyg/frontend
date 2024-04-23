import { fakeCertificateConfig, fakeCertificateValue, fakePatient, fakeRadioBooleanElement, fakeTextAreaElement } from '../../faker'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigLayout,
  ConfigTypes,
} from '../../types/certificate'
import { Question, QuestionType } from '../../types/question'
import { ResourceLink } from '../../types/resourceLink'

/**
 * @deprecated use fakeTextAreaElement()
 */
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

/**
 * @deprecated use fakeCheckboxMultipleCodeElement()
 */
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

/**
 * @deprecated use fakeCategoryElement()
 */
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

/**
 * @deprecated use fakeCategoryElement()
 */
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

/**
 * @deprecated use fakeCertificate()
 */
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
      patient: fakePatient({
        personId: {
          id: '',
          type: '',
        },
        firstName: '',
        fullName: '',
        lastName: '',
        street: 'Street 1',
        zipCode: '12345',
        city: 'City',
      }),
      relations: {
        children: [],
        parent: null,
      },
      version: 1,
      typeVersion: '1.0',
    },
    data: {
      ...fakeRadioBooleanElement({ id: '1.1' }),
      ...fakeTextAreaElement({ id: '1.2' }),
      '1.3': getAnotherTextElement(),
      '28': getCheckBoxElement(),
      funktionsnedsattning: getCategoryFunktionsnedsattning(),
      sysselsattning: getCategorySysselsattning(),
    },
    links,
  }
}

/**
 * @deprecated use fakeCertificate()
 */
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
      patient: fakePatient({
        personId: {
          id: '',
          type: '',
        },
        firstName: '',
        fullName: '',
        lastName: '',
        street: '',
        zipCode: '',
        city: '',
      }),
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
