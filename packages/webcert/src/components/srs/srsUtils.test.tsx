import { fakeSrsPrediction, SrsSickLeaveChoice } from '@frontend/common'
import {
  getCurrentRiskDataPoint,
  getFilteredPredictions,
  getPreviousRiskDataPoint,
  getRiskDataPoint,
  getRiskOpinionLabel,
  getSickLeaveChoicesLabel,
  hasCurrentRiskDataPoint,
  RISK_LABEL_DISABLED,
  RISK_LABEL_NOT_AVAILABLE,
  RISK_LABELS,
  SICKLEAVE_CHOICES_TEXTS,
  SRS_OPINION_IDS,
  SRS_OPINION_LABELS,
} from './srsUtils'

describe('SRS Utils', () => {
  describe('GetSickLeaveChoicesLabel', () => {
    it('should return correct label for new sickleave', () => {
      const result = getSickLeaveChoicesLabel(SrsSickLeaveChoice.NEW)
      expect(result).toEqual(SICKLEAVE_CHOICES_TEXTS[0])
    })

    it('should return correct label for extension', () => {
      const result = getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION)
      expect(result).toEqual(SICKLEAVE_CHOICES_TEXTS[1])
    })

    it('should return correct label for extension after 60 days', () => {
      const result = getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS)
      expect(result).toEqual(SICKLEAVE_CHOICES_TEXTS[2])
    })
  })

  describe('GetRiskOpinionLabel', () => {
    it.each(SRS_OPINION_IDS)('should return correct label for risk opinion choice', (id) => {
      const result = getRiskOpinionLabel(id)
      const index = SRS_OPINION_IDS.findIndex((item: string) => item === id)
      expect(result).toEqual(SRS_OPINION_LABELS[index])
    })

    it('should return empty string if id does not exist', () => {
      const result = getRiskOpinionLabel('id')
      expect(result).toEqual('')
    })
  })

  describe('GetRiskDataPoint', () => {
    const label = 'label'
    const risk = 0.5
    const timestamp = '2020-02-02'
    const sickLeaveChoice = SrsSickLeaveChoice.NEW
    const riskOpinion = 'HOGRE'

    it('should return label as name', () => {
      const result = getRiskDataPoint(label, risk, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.name).toEqual(label)
    })

    it('should return risk multiplied with 100', () => {
      const result = getRiskDataPoint(label, risk, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.risk).toEqual('50')
    })

    it('should - as risk if risk is negative', () => {
      const result = getRiskDataPoint(label, -1, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.risk).toEqual('-')
    })

    it('should round risk to whole number', () => {
      const result = getRiskDataPoint(label, 0.3333, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.risk).toEqual('33')
    })

    it('should set timestamp as timestamp', () => {
      const result = getRiskDataPoint(label, risk, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.timestamp).toEqual(timestamp)
    })

    it('should set sickleave choice label as sickleave choice', () => {
      const result = getRiskDataPoint(label, risk, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.sickLeaveChoice).toEqual(SICKLEAVE_CHOICES_TEXTS[0])
    })

    it('should set risk opinion label as risk opinion', () => {
      const result = getRiskDataPoint(label, risk, sickLeaveChoice, riskOpinion, timestamp)
      expect(result.riskOpinion).toEqual(SRS_OPINION_LABELS[0])
    })
  })

  describe('GetFilteredPredictions', () => {
    it('should return predictions with same diagnosis code as first prediction', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      const result = getFilteredPredictions([firstPrediction, secondPrediction])
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(firstPrediction)
      expect(result[1]).toEqual(secondPrediction)
    })

    it('should filter predictions with different diagnosis code than first prediction', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('M20')
      const result = getFilteredPredictions([firstPrediction, secondPrediction])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(firstPrediction)
    })

    it('should include predictions with sub diagnosis code', () => {
      const firstPrediction = fakeSrsPrediction('F430')
      const secondPrediction = fakeSrsPrediction('F43')
      const result = getFilteredPredictions([firstPrediction, secondPrediction])
      expect(result).toHaveLength(2)
    })

    it('should include predictions with parent diagnosis code', () => {
      const firstPrediction = fakeSrsPrediction('F43')
      const secondPrediction = fakeSrsPrediction('F430')
      const result = getFilteredPredictions([firstPrediction, secondPrediction])
      expect(result).toHaveLength(2)
    })

    it('should return empty array if predictions is empty', () => {
      const result = getFilteredPredictions([])
      expect(result).toHaveLength(0)
    })
  })

  describe('GetPreviousRiskDataPoint', () => {
    it('should return RISK_LABEL_NOT_AVAILABLE if previous prediction was for different diagnosis code', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('M79')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.name).toEqual(RISK_LABEL_NOT_AVAILABLE)
    })

    it('should return tooltip if previous prediction was for different diagnosis code', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('M79')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.tooltip).toEqual('På grund av diagnosbyte visas ej tidigare beräknade risker')
    })

    it('should return - as risk if previous risk is not available', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('M79')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.risk).toEqual('-')
    })

    it('should return RISK_LABEL_NOT_AVAILABLE if previous prediction is missing for second prediction', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      secondPrediction.probabilityOverLimit = undefined

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.name).toEqual(RISK_LABEL_NOT_AVAILABLE)
    })

    it('should return tooltip if previous prediction is missing for second prediction', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      secondPrediction.probabilityOverLimit = undefined

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.tooltip).toEqual('OBS ingen riskberäkning är gjord')
    })

    it('should return previous risk label if value is available', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.name).toEqual(RISK_LABELS[1])
    })

    it('should set probability over limit for second prediction as risk', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      secondPrediction.probabilityOverLimit = 0.5

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.risk).toEqual('50')
    })

    it('should set risk opinion if it exists', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.riskOpinion).toEqual(getRiskOpinionLabel(secondPrediction.physiciansOwnOpinionRisk))
    })

    it('should set timestamp if it exists', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)

      expect(result.timestamp).toEqual(secondPrediction.timestamp)
    })

    it('should set sick leave choice as new if parent is not extension', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction], SrsSickLeaveChoice.NEW)
      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.NEW))
    })

    it('should set sick leave choice as extension if parent is extension', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      const thirdPrediction = fakeSrsPrediction('J20')

      const result = getPreviousRiskDataPoint([firstPrediction, secondPrediction, thirdPrediction], SrsSickLeaveChoice.NEW)
      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION))
    })
  })

  describe('GetCurrentRiskDataPoint', () => {
    it('should set label as current risk if sick leave choice is new', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.NEW, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.NEW))
      expect(result.name).toEqual(RISK_LABELS[2])
    })

    it('should set label as current risk if sick leave choice is extension', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.EXTENSION, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION))
      expect(result.name).toEqual(RISK_LABELS[2])
    })

    it('should set label as disabled if sick leave choice is extension after 60 days', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS))
      expect(result.name).toEqual(RISK_LABEL_DISABLED)
    })

    it('should set tooltip if sick leave choice is extension after 60 days', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.sickLeaveChoice).toEqual(getSickLeaveChoicesLabel(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS))
      expect(result.tooltip).toEqual('Det går inte att beräkna nuvarande risk pga sjukskrivning över 60 dagar')
    })

    it('should set tooltip if probablity over limit is missing', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      firstPrediction.probabilityOverLimit = undefined

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.NEW, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.tooltip).toEqual('OBS ingen riskberäkning är gjord')
    })

    it('should set risk as probability over limit for first prediction', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      firstPrediction.probabilityOverLimit = 0.5

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.NEW, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.risk).toEqual('50')
    })

    it('should set timestamp', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      firstPrediction.probabilityOverLimit = 0.5

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.NEW, [firstPrediction, secondPrediction], 'HOGRE')

      expect(result.timestamp).toEqual(firstPrediction.timestamp)
    })

    it('should set risk opinion', () => {
      const firstPrediction = fakeSrsPrediction('J20')
      const secondPrediction = fakeSrsPrediction('J20')
      firstPrediction.probabilityOverLimit = 0.5

      const result = getCurrentRiskDataPoint(SrsSickLeaveChoice.NEW, [firstPrediction, secondPrediction], 'LAGRE')

      expect(result.riskOpinion).toEqual(getRiskOpinionLabel('LAGRE'))
    })
  })

  describe('HasCurrentDataPoint', () => {
    it('should return true if current data point exists', () => {
      const prediction = fakeSrsPrediction('J20')
      const result = hasCurrentRiskDataPoint([prediction])
      expect(result).toBeTruthy()
    })

    it('should return false if predictions is empty', () => {
      const result = hasCurrentRiskDataPoint([])
      expect(result).toBeFalsy()
    })

    it('should return false if first prediction is missing probability over limit', () => {
      const prediction = fakeSrsPrediction('J20')
      prediction.probabilityOverLimit = -1
      const result = hasCurrentRiskDataPoint([prediction])
      expect(result).toBeFalsy()
    })
  })
})
