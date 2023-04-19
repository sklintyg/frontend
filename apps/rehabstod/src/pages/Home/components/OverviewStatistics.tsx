import { IDSAlert, IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { TotalSickLeavesGraph } from './graph/TotalSickLeavesGraph'
import { GenderDivisionGraph } from './graph/GenderDivisionGraph'
import { StatisticsInformationCard } from './card/StatisticsInformationCard'
import { useGetSickLeavesSummaryQuery, useGetUserQuery } from '../../../store/api'
import { SickLeaveDegreesCard } from './card/SickLeaveDegreesCard'
import { CountSickLeaveDegreesCard } from './card/CountSickLeaveDegreesCard'
import { SickLeaveLengthsCard } from './card/SickLeaveLengthsCard'
import { DiagnosisGroupsCard } from './card/DiagnosisGroupsCard'

export function OverviewStatistics() {
  const { isLoading: loadingUser, data: user } = useGetUserQuery()
  const { isLoading: loadingSummary, data: summary } = useGetSickLeavesSummaryQuery()
  const navigate = useNavigate()
  const unitId = user && user.valdVardenhet ? user.valdVardenhet.id : ''
  const isDoctor = user && user.roles.LAKARE

  if (!loadingUser && (!user || !user.valdVardenhet)) {
    navigate('/')
  }

  if (loadingSummary) {
    return (
      <p className="p-10">
        Laddar översikt ... <IDSSpinner />
      </p>
    )
  }

  if (summary && summary.total === 0) {
    return isDoctor ? (
      <IDSAlert className="py-10">Du har inga pågående sjukfall på {unitId}.</IDSAlert>
    ) : (
      <IDSAlert className="py-10">Det finns inga pågående sjukfall på {unitId}.</IDSAlert>
    )
  }

  return (
    <div className="ids-content grid grid-cols-3 gap-4 py-10">
      <IDSCard fill>
        <TotalSickLeavesGraph total={summary ? summary.total : 0} />
      </IDSCard>
      <IDSCard fill>
        <GenderDivisionGraph genders={summary ? summary.genders : []} />
      </IDSCard>
      <IDSCard>
        <StatisticsInformationCard />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <DiagnosisGroupsCard summary={summary} />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <SickLeaveDegreesCard summary={summary} />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <CountSickLeaveDegreesCard summary={summary} />
      </IDSCard>
      <IDSCard fill className="col-span-3">
        <SickLeaveLengthsCard summary={summary} />
      </IDSCard>
    </div>
  )
}
