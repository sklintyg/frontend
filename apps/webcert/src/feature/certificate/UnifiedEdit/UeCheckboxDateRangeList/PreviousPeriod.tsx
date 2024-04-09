import InfoBox from '../../../../components/utils/InfoBox'

export function PreviousPeriod({ previousSickLeavePeriod }: { previousSickLeavePeriod: string }) {
  if (!previousSickLeavePeriod) {
    return null
  }

  return (
    <div className="iu-mb-400">
      <InfoBox type={'observe'} activateIconWrap>
        <p>{previousSickLeavePeriod}</p>
      </InfoBox>
    </div>
  )
}
