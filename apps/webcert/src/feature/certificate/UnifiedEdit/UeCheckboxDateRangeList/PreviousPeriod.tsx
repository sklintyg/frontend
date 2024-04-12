import InfoBox from '../../../../components/utils/InfoBox'

export function PreviousPeriod({ previousPeriod }: { previousPeriod: string }) {
  return (
    <div className="iu-mb-400">
      <InfoBox type={'observe'} activateIconWrap>
        <p>{previousPeriod}</p>
      </InfoBox>
    </div>
  )
}
