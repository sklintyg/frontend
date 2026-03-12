import type { SrsPrediction, ValueDiagnosisList, CertificateMetadata } from '../../types'
import { SrsSickLeaveChoice, SrsUserClientContext, CertificateStatus } from '../../types'
import { isRenewedChild } from '../../utils'

export const SKR_DIAGNOSIS_LINK_MAP: Record<string, string> = {
  R52: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/allmannasymtomochsjukhetstecken/r52smartaochvarksomejklassificerasannorstades.33589.html',
  R53: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/allmannasymtomochsjukhetstecken/r53sjukdomskanslaochtrotthet.33591.html',
  M16: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/artrosochandraledsjukdomar/m16hoftledsartros.33581.html',
  M17: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/artrosochandraledsjukdomar/m17knaartros.33583.html',
  M19: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/artrosochandraledsjukdomar/m19andraartroser.33585.html',
  M23: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/artrosochandraledsjukdomar/m23andrasjukligaforandringariknaled.33587.html',
  S52: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/frakturerochledskador/s52frakturpaunderarm.33593.html',
  S62: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/frakturerochledskador/s62frakturpahandledochhand.33595.html',
  S82: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/frakturerochledskador/s82frakturpaunderbeninklusivefotled.33597.html',
  S83: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/frakturerochledskador/s83luxationochdistorsioniknaetslederochligament.33599.html',
  F31: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f31bipolarsjukdom.33535.html',
  F32: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f32depressivepisod.33537.html',
  F33: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f33recidiverandedepression.33539.html',
  F41: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f41andraangestsyndrom.33541.html',
  F43: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f43anpassningsstorningarochreaktionpasvarstress.33543.html',
  F430: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f430akutstressreaktion.33545.html',
  F431: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f431posttraumatiskstressyndromptsd.33547.html',
  F432: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f432anpassningsstorninglivskrissorgreaktion.33549.html',
  F438: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f438andraspecificeradereaktionerpasvarstress.33551.html',
  F438A: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/psykiskasjukdomarochsyndrom/f438autmattningssyndrom.33553.html',
  I63: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarihjarnanskarl/i63cerebralinfarkt.33601.html',
  G56: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/g56mononeuropatisjukdomienendaperifernerviovreextremitet.33555.html',
  M51: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m51diskbrackandrasjukdomarimellankotsskivorna.33557.html',
  M54: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m54ryggvark.33561.html',
  M542: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m542cervikalgi.33563.html',
  M544: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m544lumbagomedischias.33565.html',
  M545: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m545lumbago.33567.html',
  M75: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m75sjukdomstillstandiskulderled.33569.html',
  M754: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m754impingementsyndromiaxelled.33571.html',
  M77: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m77andraentesopatiersjukdomariperiferaligamentochmuskelfasten.33573.html',
  M79: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m79andrasjukdomstillstandimjukvavnadersomejklassificerasannorstades.33575.html',
  M791: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m791myalgi.33577.html',
  M797: 'https://extra.skr.se/rattsjukskrivning/radochatgarder/sjukdomarimuskuloskeletalasystemetochnerver/m797fibromyalgi.33579.html',
}

export const SKR_FALLBACK_LINK = 'https://extra.skr.se/rattsjukskrivning/radochatgarder'

export const getSKRLink = (diagnosisCode: string): string => {
  const normalised = diagnosisCode.toUpperCase()
  return SKR_DIAGNOSIS_LINK_MAP[normalised] ?? SKR_FALLBACK_LINK
}

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
