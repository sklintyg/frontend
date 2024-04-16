import { useSelector } from 'react-redux'
import InfoBox from '../../../../components/utils/InfoBox'
import { getPeriodWarning } from '../../../../store/fmb/fmbSelectors'

export function UeCheckboxDateRangeListWarning() {
  const warning = useSelector(getPeriodWarning)

  if (warning === '' || warning == null) return null

  return (
    <div className="iu-mb-400">
      <InfoBox type="info" activateIconWrap>
        <p>{warning}</p>
      </InfoBox>
    </div>
  )
}
