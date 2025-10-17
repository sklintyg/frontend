import { setRiskOpinion, updateRiskOpinion } from '../../../store/srs/srsActions'
import {
  getCareGiverId,
  getCertificateId,
  getPatientId,
  getPredictionDiagnosisCode,
  getRiskOpinion,
  getSrsPredictions,
  getUnitId,
} from '../../../store/srs/srsSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import RadioButton from '../../Inputs/RadioButton'
import { SRS_OPINION_IDS, SRS_OPINION_LABELS, hasCurrentRiskDataPoint } from '../srsUtils'

const SRS_OPINION_TITLE = 'Enligt min läkarbedömning anser jag att patientens risk är'

const SrsRiskOpinion = () => {
  const dispatch = useAppDispatch()
  const riskOpinion = useAppSelector(getRiskOpinion)
  const unitId = useAppSelector(getUnitId)
  const careGiverId = useAppSelector(getCareGiverId)
  const patientId = useAppSelector(getPatientId)
  const certificateId = useAppSelector(getCertificateId)
  const diagnosisCode = useAppSelector(getPredictionDiagnosisCode)
  const predictions = useAppSelector(getSrsPredictions)

  if (!hasCurrentRiskDataPoint(predictions)) {
    return null
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRiskOpinion(event.currentTarget.value))
    dispatch(
      setRiskOpinion({
        unitId: unitId,
        careGiverId: careGiverId,
        patientId: patientId,
        certificateId: certificateId,
        code: diagnosisCode,
        riskOpinion: event.currentTarget.value,
      })
    )
  }

  return (
    <>
      <label className="iu-fw-bold">{SRS_OPINION_TITLE}</label>
      <div role="radiogroup" className="ic-radio-group-horizontal iu-mb-400">
        {SRS_OPINION_IDS.map((id, index) => {
          return (
            <RadioButton
              label={SRS_OPINION_LABELS[index]}
              onChange={(event) => handleOnChange(event)}
              checked={riskOpinion === id}
              value={id}
              id={id}
              key={`opinion-option-${id}`}
            />
          )
        })}
      </div>
    </>
  )
}

export default SrsRiskOpinion
