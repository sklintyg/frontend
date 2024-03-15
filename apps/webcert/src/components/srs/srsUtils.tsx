import {
  SrsSickLeaveChoice,
  SrsPrediction,
  ValueDiagnosisList,
  CertificateMetadata,
  SrsUserClientContext,
  CertificateStatus,
} from '../../types'
import { isRenewedChild } from '../../utils'

export const SICKLEAVE_CHOICES_TEXTS = ['Ny sjukskrivning', 'Förlängning', 'Förlängning efter 60 dagar']
export const SRS_OPINION_LABELS = ['Högre', 'Korrekt', 'Lägre', 'Kan ej bedöma']
export const SRS_OPINION_IDS = ['HOGRE', 'KORREKT', 'LAGRE', 'KAN_EJ_BEDOMA']
export const RISK_LABELS = ['Genomsnittlig risk', 'Tidigare risk', 'Aktuell risk', 'Beräkna aktuell risk']
export const RISK_LABEL_DISABLED = 'Kan ej beräknas'
export const RISK_LABEL_NOT_AVAILABLE = 'Tidigare beräkning'

export const getSickLeaveChoicesLabel = (choice: SrsSickLeaveChoice) => {
  switch (choice) {
    case SrsSickLeaveChoice.NEW:
      return SICKLEAVE_CHOICES_TEXTS[0]
    case SrsSickLeaveChoice.EXTENSION:
      return SICKLEAVE_CHOICES_TEXTS[1]
    case SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS:
      return SICKLEAVE_CHOICES_TEXTS[2]
  }
}

export const getRiskOpinionLabel = (opinion: string) => {
  const index = SRS_OPINION_IDS.findIndex((text) => opinion === text)
  return index >= 0 ? SRS_OPINION_LABELS[index] : ''
}

export const getRiskDataPoint = (
  label: string,
  risk: number | undefined,
  sickLeaveChoice: SrsSickLeaveChoice,
  riskOpinion?: string,
  timestamp?: string,
  tooltip?: string
) => {
  return {
    name: label,
    risk: risk && risk > 0 ? Math.round(risk * 100).toString() : '-',
    timestamp: timestamp,
    sickLeaveChoice: getSickLeaveChoicesLabel(sickLeaveChoice),
    riskOpinion: getRiskOpinionLabel(riskOpinion ? riskOpinion : ''),
    tooltip: tooltip,
  }
}

export const getFilteredPredictions = (predictions: SrsPrediction[]) => {
  if (!predictions || predictions.length == 0) {
    return []
  }

  const diagnosisCode = predictions[0].diagnosisCode
  return predictions.filter(
    (prediction) =>
      (prediction.diagnosisCode && prediction.diagnosisCode.includes(diagnosisCode)) || diagnosisCode.includes(prediction.diagnosisCode)
  )
}

export const getPreviousRiskDataPoint = (predictions: SrsPrediction[], sickLeaveChoice: SrsSickLeaveChoice) => {
  const filteredPredictions = getFilteredPredictions(predictions)
  const isParentCertificateAnExtension = predictions.length > 2

  if (filteredPredictions.length > 1) {
    return getRiskDataPoint(
      filteredPredictions[1].probabilityOverLimit ? RISK_LABELS[1] : RISK_LABEL_NOT_AVAILABLE,
      filteredPredictions[1].probabilityOverLimit,
      isParentCertificateAnExtension ? SrsSickLeaveChoice.EXTENSION : SrsSickLeaveChoice.NEW,
      filteredPredictions[1].physiciansOwnOpinionRisk,
      filteredPredictions[1].timestamp,
      filteredPredictions[1].probabilityOverLimit ? undefined : 'OBS ingen riskberäkning är gjord'
    )
  }

  return getRiskDataPoint(
    RISK_LABEL_NOT_AVAILABLE,
    -1,
    sickLeaveChoice,
    undefined,
    undefined,
    predictions.length > filteredPredictions.length
      ? 'På grund av diagnosbyte visas ej tidigare beräknade risker'
      : 'OBS ingen riskberäkning är gjord'
  )
}

export const getCurrentRiskDataPoint = (sickLeaveChoice: SrsSickLeaveChoice, predictions: SrsPrediction[], riskOpinion: string) => {
  const filteredPredictions = getFilteredPredictions(predictions)
  const isCalculatingRiskDisabled = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS
  return isCalculatingRiskDisabled
    ? getRiskDataPoint(
        RISK_LABEL_DISABLED,
        -1,
        sickLeaveChoice,
        undefined,
        undefined,
        'Det går inte att beräkna nuvarande risk pga sjukskrivning över 60 dagar'
      )
    : getRiskDataPoint(
        RISK_LABELS[2],
        filteredPredictions[0].probabilityOverLimit,
        sickLeaveChoice,
        riskOpinion,
        filteredPredictions[0].timestamp,
        filteredPredictions[0].probabilityOverLimit ? undefined : 'OBS ingen riskberäkning är gjord'
      )
}

export const hasCurrentRiskDataPoint = (predictions: SrsPrediction[]) => {
  const filteredPredictions = getFilteredPredictions(predictions)
  return (
    filteredPredictions &&
    !!filteredPredictions[0] &&
    !!filteredPredictions[0].probabilityOverLimit &&
    filteredPredictions[0].probabilityOverLimit > 0
  )
}

export const getMainDiagnosisCode = (value: ValueDiagnosisList | null) => {
  if (!value) {
    return ''
  }
  const mainDiagnosis = value.list.find((diagnosis) => diagnosis.id.includes('0'))
  return mainDiagnosis ? mainDiagnosis.code : ''
}

export const getUserClientContextForCertificate = (metadata: CertificateMetadata, userLaunchFromOrigin?: string) => {
  if (userLaunchFromOrigin === 'rs') {
    return SrsUserClientContext.SRS_REH
  }

  if (metadata.status === CertificateStatus.SIGNED) {
    return SrsUserClientContext.SRS_SIGNED
  }

  if (isRenewedChild(metadata)) {
    return SrsUserClientContext.SRS_FRL
  }

  return SrsUserClientContext.SRS_UTK
}

// From original SRS code in Angular-repo
export const isScrolledIntoView = (element: HTMLElement, fullyInView: boolean, offset: number) => {
  const pageTop = window.document.documentElement.scrollTop
  const pageBottom = pageTop + window.innerHeight + offset
  const elementTop = element.getBoundingClientRect().top
  const elementBottom = elementTop + element.getBoundingClientRect().height

  if (fullyInView) {
    return pageTop < elementTop && pageBottom > elementBottom
  } else {
    return elementTop <= pageBottom && elementBottom >= pageTop
  }
}
