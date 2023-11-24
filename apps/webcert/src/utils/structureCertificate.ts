import { CertificateData, CertificateDataElement, CertificateDataElementStyleEnum, ConfigTypes, sortByIndex } from '@frontend/common'
import { CertificateStructure } from '../store/certificate/certificateSelectors'

const hasSubQuestionId =
  (id: string) =>
  ({ subQuestionIds }: CertificateStructure) =>
    subQuestionIds.includes(id)

const filterSubQuestions =
  (id: string) =>
  ({ config, parent, style }: CertificateDataElement) =>
    config.type !== ConfigTypes.CATEGORY && parent === id && style !== CertificateDataElementStyleEnum.HIDDEN

export const structureCertificate = (data: CertificateData): CertificateStructure[] => {
  const elements = Object.values(data).sort(sortByIndex)

  return elements.reduce((structure: CertificateStructure[], element: CertificateDataElement) => {
    if (structure.some(hasSubQuestionId(element.id))) {
      return structure
    }

    const subQuestionIds =
      element.config.type === ConfigTypes.CATEGORY ? [] : elements.filter(filterSubQuestions(element.id)).map((el) => el.id)

    return structure.concat({
      id: element.id,
      subQuestionIds,
      component: element.config.type,
      index: element.index,
      style: element.style,
    })
  }, [])
}
