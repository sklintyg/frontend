import { IDSAlert, IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { TotalSickLeavesGraph } from './graph/TotalSickLeavesGraph'
import { GenderDivisionGraph } from './graph/GenderDivisionGraph'
import { StatisticsInformationCard } from './card/StatisticsInformationCard'
import { useGetSickLeavesSummaryQuery, useGetUserQuery } from '../../../store/api'
import { SickLeaveDegreesCard } from './card/SickLeaveDegreesCard'
import { CountSickLeaveDegreesCard } from './card/CountSickLeaveDegreesCard'
import { SickLeaveLengthsCard } from './card/SickLeaveLengthsCard'
import { DiagnosisGroupsCard } from './card/DiagnosisGroupsCard'
import { UserUrval } from '../../../schemas'
import { DisplayError } from '../../../error/DisplayError'

export function OverviewStatistics() {
  const { data: user } = useGetUserQuery()
  const { isLoading: loadingSummary, data: summary, error } = useGetSickLeavesSummaryQuery()
  const unit = user && user.valdVardenhet ? user.valdVardenhet.namn : ''
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME

  if (loadingSummary) {
    return (
      <p className="p-10">
        Laddar översikt ... <IDSSpinner />
      </p>
    )
  }

  if (summary && summary.total === 0) {
    return (
      <IDSAlert className="py-10">
        {isDoctor ? 'Du har' : 'Det finns'} inga pågående sjukfall på {unit}.
      </IDSAlert>
    )
  }

  if (error) {
    return <DisplayError heading="Tekniskt fel" errorType="error" text="Översikten för enheten kan inte visas." dynamicLink={false} />
  }

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">Översikt över pågående sjukfall just nu</h1>
      <h2 className="ids-heading-3 mb-10">{unit}</h2>
      <div className="grid grid-cols-3 gap-4">
        <IDSCard fill className="bg-secondary-95">
          <TotalSickLeavesGraph total={summary ? summary.total : 0} />
        </IDSCard>
        <IDSCard fill className="bg-secondary-95">
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
    </div>
  )
}
