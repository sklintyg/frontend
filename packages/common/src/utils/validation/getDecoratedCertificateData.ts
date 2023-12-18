import {
  CertificateData,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateMetadata,
  CertificateStatus,
  ConfigTypes,
  DisableSubElementValidation,
  ResourceLink,
  ResourceLinkType,
} from '../../types'
import { filterValidationResults } from './filterValidationResults'
import { getValidationResults } from './getValidationResults'

function shouldBeReadOnly(metadata: CertificateMetadata) {
  return metadata.status === CertificateStatus.SIGNED || metadata.status === CertificateStatus.REVOKED
}

function shouldBeDisabled(metadata: CertificateMetadata, links: ResourceLink[]) {
  return (
    metadata.status === CertificateStatus.LOCKED ||
    metadata.status === CertificateStatus.LOCKED_REVOKED ||
    links.every((link) => link.type !== ResourceLinkType.EDIT_CERTIFICATE)
  )
}

function getDisabledSubElements(
  element: CertificateDataElement,
  validation: DisableSubElementValidation,
  result: boolean
): CertificateDataElement {
  const config =
    element.config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE
      ? {
          ...element.config,
          list: element.config.list.map((item) => ({
            ...item,
            disabled: validation.id.includes(item.id) ? result : item.disabled,
          })),
        }
      : element.config

  const value =
    element.value?.type === CertificateDataValueType.CODE_LIST && config.type === ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE
      ? {
          ...element.value,
          list: element.value.list.filter((item) => {
            const configItem = config.list.find((c) => c.id === item.id)
            return configItem && !configItem.disabled
          }),
        }
      : element.value

  return { ...element, config, value }
}

function validateElement(data: CertificateData, element: CertificateDataElement): CertificateDataElement {
  return filterValidationResults(getValidationResults(data, element)).reduce(
    (el: CertificateDataElement, { result, validation }): CertificateDataElement => {
      switch (validation.type) {
        case CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION:
        case CertificateDataValidationType.MANDATORY_VALIDATION:
          return { ...el, mandatory: !result }
        case CertificateDataValidationType.SHOW_VALIDATION:
          return { ...el, visible: result }
        case CertificateDataValidationType.HIDE_VALIDATION:
          return { ...el, visible: !result }
        case CertificateDataValidationType.ENABLE_VALIDATION:
          return { ...el, disabled: !result }
        case CertificateDataValidationType.DISABLE_VALIDATION:
          return { ...el, disabled: result }
        case CertificateDataValidationType.HIGHLIGHT_VALIDATION:
          return { ...el, style: result ? CertificateDataElementStyleEnum.HIGHLIGHTED : CertificateDataElementStyleEnum.NORMAL }
        case CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION:
          return getDisabledSubElements(el, validation, result)
        case CertificateDataValidationType.AUTO_FILL_VALIDATION:
          return result ? { ...el, value: validation.fillValue } : el
        default:
          return el
      }
    },
    element
  )
}

function isVisible(element: CertificateDataElement) {
  return element.visible ?? true
}

export function getDecoratedCertificateData(data: CertificateData, metadata: CertificateMetadata, links: ResourceLink[]): CertificateData {
  const readOnly = shouldBeReadOnly(metadata)
  const disabled = shouldBeDisabled(metadata, links)

  const decoratedData = Object.fromEntries(
    Object.entries(data).map<[string, CertificateDataElement]>(([id, element]) =>
      readOnly ? [id, { ...element, visible: isVisible(element), readOnly }] : [id, { ...element, visible: isVisible(element), disabled }]
    )
  )

  return readOnly
    ? decoratedData
    : Object.fromEntries(Object.entries(decoratedData).map(([id, element]) => [id, validateElement(decoratedData, element)]))
}
