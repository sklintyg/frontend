import { UvTable } from '../../../../components/UnifiedView/UvTable/UvTable'
import type { CertificateDataElement, ValueViewTable, ConfigUeViewTable } from '../../../../types'

export interface Props {
  question: CertificateDataElement
}

const UeViewTable = ({ question }: Props) => {
  return (
    <div className="iu-p-none">
      <UvTable value={question.value as ValueViewTable} config={question.config as ConfigUeViewTable} />
    </div>
  )
}

export default UeViewTable
