import {
  fakeCategoryElement,
  fakeCheckboxMultipleCodeElement,
  fakePatient,
  fakeRadioBooleanElement,
  fakeTextAreaElement,
} from '../../faker'
import { Certificate, CertificateDataElement, CertificateStatus, ConfigTypes } from '../../types/certificate'
import { Question, QuestionType } from '../../types/question'
import { ResourceLink } from '../../types/resourceLink'

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
      ...fakeTextAreaElement({ id: '1.3' }),
      ...fakeCheckboxMultipleCodeElement({ id: '28' }),
      ...fakeCategoryElement({ id: 'funktionsnedsattning' }),
      ...fakeCategoryElement({ id: 'sysselsattning' }),
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
