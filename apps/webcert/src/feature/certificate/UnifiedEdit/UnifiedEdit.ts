import type { CertificateDataConfigType, CertificateDataElement, ValueType } from '../../../types'

export type UnifiedEdit<C extends CertificateDataConfigType, V extends ValueType> = {
  question: CertificateDataElement & {
    config: C
    value: V
  }
  disabled: boolean
  onUpdate: (value: V) => void
}
