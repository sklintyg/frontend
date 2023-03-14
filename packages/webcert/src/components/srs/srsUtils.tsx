import { SrsPrediction, SrsSickLeaveChoice } from '@frontend/common'

export const SICKLEAVE_CHOICES_TEXTS = ['Ny sjukskrivning', 'Förlängning', 'Förlängning efter 60 dagar']
export const SRS_OPINION_LABELS = ['Högre', 'Korrekt', 'Lägre', 'Kan ej bedöma']
export const SRS_OPINION_IDS = ['HOGRE', 'KORREKT', 'LAGRE', 'KAN_EJ_BEDOMA']
export const RISK_LABELS = ['Genomsnittlig risk', 'Tidigare risk', 'Aktuell risk', 'Beräkna aktuell risk', 'Tidigare beräkning']
export const RISK_LABEL_DISABLED = 'Kan ej beräknas'
export const RISK_LABEL_MISSING = 'Beräknades inte'

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
  risk: number,
  sickLeaveChoice: SrsSickLeaveChoice,
  riskOpinion?: string,
  timestamp?: Date
) => {
  return {
    name: label,
    risk: risk > 0 ? Math.round(risk * 100) : '-',
    timestamp: timestamp,
    sickLeaveChoice: getSickLeaveChoicesLabel(sickLeaveChoice),
    riskOpinion: getRiskOpinionLabel(riskOpinion ? riskOpinion : ''),
  }
}

export const getPreviousRiskDataPoint = (
  filteredPredictions: SrsPrediction[],
  totalNumberOfPredictions: number,
  sickLeaveChoice: SrsSickLeaveChoice
) => {
  if (totalNumberOfPredictions < filteredPredictions.length) {
    getRiskDataPoint(RISK_LABELS[4], -1, sickLeaveChoice)
  }

  const isParentCertificateAnExtension = totalNumberOfPredictions > 2

  if (filteredPredictions.length > 1) {
    return getRiskDataPoint(
      RISK_LABELS[1],
      filteredPredictions[1].probabilityOverLimit,
      isParentCertificateAnExtension ? SrsSickLeaveChoice.EXTENSION : SrsSickLeaveChoice.NEW,
      filteredPredictions[1].physiciansOwnOpinionRisk,
      filteredPredictions[1].timestamp
    )
  }

  return getRiskDataPoint(RISK_LABEL_MISSING, -1, sickLeaveChoice)
}

export const getCurrentRiskDataPoint = (sickLeaveChoice: SrsSickLeaveChoice, filteredPredictions: SrsPrediction[], riskOpinion: string) => {
  const isCalculatingRiskDisabled = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS
  return isCalculatingRiskDisabled
    ? getRiskDataPoint(RISK_LABEL_DISABLED, -1, sickLeaveChoice)
    : getRiskDataPoint(
        RISK_LABELS[2],
        filteredPredictions[0].probabilityOverLimit,
        sickLeaveChoice,
        riskOpinion,
        filteredPredictions[0].timestamp
      )
}
