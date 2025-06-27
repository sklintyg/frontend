import InfoBox from '../../../../components/utils/InfoBox'
import { getPeriodWarning } from '../../../../store/fmb/fmbSelectors'
import { useAppSelector } from '../../../../store/store'

export function UeCheckboxDateRangeListWarning() {
  const warning = useAppSelector(getPeriodWarning)

  if (warning === '' || warning == null) return null

  return (
    <div className="iu-mb-400">
      <InfoBox type="info" activateIconWrap>
        <p>{warning}</p>
      </InfoBox>
    </div>
  )
}
