import { startOfToday, format } from 'date-fns'
import { getFieldValuePair } from './getFieldValuePair'
import { CertificateDataValueType } from '../../types/certificate'

it('Should convert list of MEDICAL_INVESTIGATION to key-value pair', () => {
  const date = startOfToday()
  expect(
    getFieldValuePair({
      type: CertificateDataValueType.MEDICAL_INVESTIGATION_LIST,
      list: [
        {
          type: CertificateDataValueType.MEDICAL_INVESTIGATION,
          date: {
            type: CertificateDataValueType.DATE,
            id: 'underlag[0].datum',
            date: format(date, 'yyyy-MM-dd'),
          },
          informationSource: {
            type: CertificateDataValueType.TEXT,
            id: 'underlag[0].hamtasFran',
            text: 'loremIpsum',
          },
          investigationType: {
            type: CertificateDataValueType.CODE,
            id: 'underlag[0].typ',
            code: 'ARBETSTERAPEUT',
          },
        },
      ],
    })
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
