import { format, startOfToday } from 'date-fns'
import { fakeCertificateValue } from '../../faker'
import { CertificateDataValueType } from '../../types/certificateDataValue'
import { getFieldValuePair } from './getFieldValuePair'

it('Should convert list of MEDICAL_INVESTIGATION to key-value pair', () => {
  const date = startOfToday()
  expect(
    getFieldValuePair(
      fakeCertificateValue.medicalInvestigationList({
        list: [
          {
            date: {
              id: 'underlag[0].datum',
              date: format(date, 'yyyy-MM-dd'),
            },
            informationSource: {
              id: 'underlag[0].hamtasFran',
              text: 'loremIpsum',
            },
            investigationType: {
              id: 'underlag[0].typ',
              code: 'ARBETSTERAPEUT',
            },
          },
        ],
      })
    )
  ).toEqual({
    'underlag[0].datum': {
      type: CertificateDataValueType.DATE,
      id: 'underlag[0].datum',
      date: format(date, 'yyyy-MM-dd'),
    },
    'underlag[0].hamtasFran': {
      type: CertificateDataValueType.TEXT,
      id: 'underlag[0].hamtasFran',
      text: 'loremIpsum',
    },
    'underlag[0].typ': {
      type: CertificateDataValueType.CODE,
      id: 'underlag[0].typ',
      code: 'ARBETSTERAPEUT',
    },
  })
})

it('Should convert list of TEXTFIELD to key-value pair', () => {
  expect(getFieldValuePair(fakeCertificateValue.text({ id: 'foo' }))).toEqual({
    foo: {
      type: CertificateDataValueType.TEXT,
      id: 'foo',
      text: null,
    },
  })
})

it('Should convert list of VISUAL_ACUITIES to key-value pair', () => {
  expect(
    getFieldValuePair(
      fakeCertificateValue.visualAcuity({
        rightEye: {
          withoutCorrection: { id: 'rightEye_withoutCorrection' },
          withCorrection: { id: 'rightEye_withCorrection' },
          contactLenses: { id: 'rightEye_contactLenses' },
        },
        leftEye: {
          withoutCorrection: { id: 'leftEye_withoutCorrection' },
          withCorrection: { id: 'leftEye_withCorrection' },
          contactLenses: { id: 'leftEye_contactLenses' },
        },
        binocular: {
          withoutCorrection: { id: 'binocular_withoutCorrection' },
          withCorrection: { id: 'binocular_withCorrection' },
          contactLenses: { id: 'binocular_contactLenses' },
        },
      })
    )
  ).toEqual({
    binocular_withoutCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'binocular_withoutCorrection',
    },
    binocular_withCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'binocular_withCorrection',
    },
    binocular_contactLenses: {
      type: CertificateDataValueType.BOOLEAN,
      selected: false,
      id: 'binocular_contactLenses',
    },
    rightEye_withoutCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'rightEye_withoutCorrection',
    },
    rightEye_withCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'rightEye_withCorrection',
    },
    rightEye_contactLenses: {
      type: CertificateDataValueType.BOOLEAN,
      selected: false,
      id: 'rightEye_contactLenses',
    },
    leftEye_withoutCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'leftEye_withoutCorrection',
    },
    leftEye_withCorrection: {
      type: CertificateDataValueType.DOUBLE,
      value: null,
      id: 'leftEye_withCorrection',
    },
    leftEye_contactLenses: {
      type: CertificateDataValueType.BOOLEAN,
      selected: false,
      id: 'leftEye_contactLenses',
    },
  })
})
