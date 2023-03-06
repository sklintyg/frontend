import React, { useEffect } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
import SRSPanelError from './SRSPanelError'
import SRSPanelNoSupportInfo from './SRSPanelNoSupportInfo'
import SRSPanelEmptyInfo from './SRSPanelEmptyInfo'
import { useDispatch, useSelector } from 'react-redux'
import { getDiagnosisCodes, getDiagnosisListValue, getHasError } from '../../store/srs/srsSelectors'
import SRSPanelFooter from './SRSPanelFooter'
import { getSRSCodes } from '../../store/srs/srsActions'

export const SRS_TITLE = 'Risk för sjukskrivning längre än 90 dagar'

const SRSPanel: React.FC = () => {
  const dispatch = useDispatch()
  const diagnosisListValue = useSelector(getDiagnosisListValue)
  const diagnosisCodes = useSelector(getDiagnosisCodes)
  const hasError = useSelector(getHasError)

  const isEmpty = !diagnosisListValue || diagnosisListValue.list.length == 0

  useEffect(() => {
    if (!isEmpty && diagnosisCodes.length == 0) {
      dispatch(getSRSCodes())
    }
  }, [isEmpty, diagnosisCodes, dispatch])

  const getSupportedDiagnosisCode = (): string => {
    if (isEmpty || diagnosisCodes.length == 0) {
      return ''
    }

    const result = diagnosisCodes.find((code) => diagnosisListValue?.list[0].code === code)
    return result ? result : ''
  }

  const hasSupportedDiagnosisCode = (): boolean => {
    return getSupportedDiagnosisCode().length > 0
  }

  const getContent = () => {
    if (hasError) {
      return <SRSPanelError />
    }

    if (isEmpty) {
      return <SRSPanelEmptyInfo />
    }

    if (!hasSupportedDiagnosisCode()) {
      return <SRSPanelNoSupportInfo />
    }

    return <p className="iu-fw-bold">Riskberäkningen gäller:</p>
  }

  return (
    <>
      <PanelHeader description={SRS_TITLE} />
      <div className="iu-border-grey-300 iu-p-500 iu-m-none">{getContent()}</div>
      {hasSupportedDiagnosisCode() && <SRSPanelFooter diagnosisCode={getSupportedDiagnosisCode()} />}
    </>
  )
}

export default SRSPanel
