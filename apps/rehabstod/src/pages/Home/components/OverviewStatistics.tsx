import { Card } from '@frontend/components'
import { IDSSpinner } from '@frontend/ids-react-ts'
import { PageHeading } from '../../../components/PageHeading/PageHeading'
import { EmptyTableAlert } from '../../../components/Table/EmptyTableAlert'
import { ErrorAlert } from '../../../components/error/ErrorAlert/ErrorAlert'
import { UserUrval } from '../../../schemas'
import { useGetUserQuery } from '../../../store/api'
import { useGetSickLeavesSummaryQuery } from '../../../store/sickLeaveApi'
import { CountSickLeaveDegreesCard } from './card/CountSickLeaveDegreesCard'
import { DiagnosisGroupsCard } from './card/DiagnosisGroupsCard'
import { SickLeaveDegreesCard } from './card/SickLeaveDegreesCard'
import { SickLeaveLengthsCard } from './card/SickLeaveLengthsCard'
import { StatisticsInformationCard } from './card/StatisticsInformationCard'
import { GenderDivisionGraph } from './graph/GenderDivisionGraph'
import { TotalSickLeavesGraph } from './graph/TotalSickLeavesGraph'

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
    return <EmptyTableAlert tableName=" pågående sjukfall" />
  }

  if (error) {
    return (
      <ErrorAlert
        heading="Tekniskt fel"
        errorType="error"
        text="Översikten för enheten kan inte visas."
        dynamicLink={false}
        error={error}
      />
    )
  }

  return (
    <>
      <PageHeading
        title={isDoctor ? 'Översikt över mina pågående sjukfall just nu' : 'Översikt över alla pågående sjukfall just nu'}
        subTitle={unit}
      />
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card fill={1}>
          <TotalSickLeavesGraph total={summary ? summary.total : 0} />
        </Card>
        <Card fill={1}>
          <GenderDivisionGraph genders={summary ? summary.genders : []} />
        </Card>
        <Card>
          <StatisticsInformationCard />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <DiagnosisGroupsCard summary={summary} />
        <SickLeaveDegreesCard summary={summary} />
        <CountSickLeaveDegreesCard summary={summary} />
        <SickLeaveLengthsCard summary={summary} />
      </div>
    </>
  )
}
