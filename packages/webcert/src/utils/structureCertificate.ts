import { Certificate, CertificateDataElement, ConfigTypes, sortByIndex } from '@frontend/common'
import { CertificateStructure } from '../store/certificate/certificateSelectors'

const hasSubQuestionId = (id: string) => ({ subQuestionIds }: CertificateStructure) => subQuestionIds.includes(id)

export const structureCertificate = (certificate?: Certificate): CertificateStructure[] => {
  if (certificate == null) {
    return []
  }

  const elements = Object.values(certificate.data)

  return elements
    .sort(sortByIndex)
    .reduce((structure: CertificateStructure[], element: CertificateDataElement) => {
      if (structure.some(hasSubQuestionId(element.id))) {
        return structure
      }

      const subQuestionIds = elements
        .filter(() => element.config.type !== ConfigTypes.CATEGORY)
        .filter((el) => el.config.type !== ConfigTypes.CATEGORY)
        .filter((el) => el.parent === element.id)
        .sort(sortByIndex)
        .map((el) => el.id)

      return structure.concat({
        id: element.id,
        subQuestionIds,
        component: element.config.type,
        index: element.index,
        style: element.style,
      })
    }, [])
    .sort(sortByIndex)
}
