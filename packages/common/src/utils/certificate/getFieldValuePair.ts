import { ValueType, CertificateDataValueType } from '../../types/certificate'

const getFieldValuePairFromList = (list: ValueType[]) =>
  list.reduce((result: Record<string, ValueType>, value: ValueType) => Object.assign(result, getFieldValuePair(value)), {})

export const getFieldValuePair = (value: ValueType): Record<string, ValueType> => {
  switch (value.type) {
    case CertificateDataValueType.BOOLEAN:
    case CertificateDataValueType.CODE:
    case CertificateDataValueType.DATE_RANGE:
    case CertificateDataValueType.DATE:
    case CertificateDataValueType.DIAGNOSIS:
    case CertificateDataValueType.DOUBLE:
    case CertificateDataValueType.ICF:
    case CertificateDataValueType.TEXT:
    case CertificateDataValueType.YEAR:
      return { [value.id]: value }
    case CertificateDataValueType.CAUSE_OF_DEATH:
      return {
        ...getFieldValuePair(value.debut),
        ...getFieldValuePair(value.description),
        ...getFieldValuePair(value.specification),
      }
    case CertificateDataValueType.MEDICAL_INVESTIGATION:
      return {
        ...getFieldValuePair(value.date),
        ...getFieldValuePair(value.informationSource),
        ...getFieldValuePair(value.investigationType),
      }

    case CertificateDataValueType.VISUAL_ACUITIES:
      return {
        ...getFieldValuePair(value.rightEye),
        ...getFieldValuePair(value.leftEye),
        ...getFieldValuePair(value.binocular),
      }
    case CertificateDataValueType.VISUAL_ACUITY: {
      return {
        ...getFieldValuePair(value.withoutCorrection),
        ...getFieldValuePair(value.withCorrection),
        ...(value.contactLenses && getFieldValuePair(value.contactLenses)),
      }
    }
    default:
      return value.list instanceof Array ? getFieldValuePairFromList(value.list) : {}
  }
}
