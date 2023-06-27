import { skipToken } from '@reduxjs/toolkit/query'
import { useLocation, useParams } from 'react-router-dom'
import { useGetPopulatedFiltersQuery, useGetSickLeavePatientQuery, useGetUserQuery } from '../../../../store/api'
import { isDateBeforeToday } from '../../../../utils/isDateBeforeToday'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { SelectRekoStatus } from '../../../../components/SelectRekoStatus/SelectRekoStatus'
import { UserUrval } from '../../../../schemas'
import { ModifyPatientTableColumns } from './ModifyPatientTableColumns'
import { PatientSickLeavesTable } from './PatientSickLeavesTable'
import { PatientOverview } from '../patientOverview/PatientOverview'
import { PuResponse } from '../../../../schemas/patientSchema'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { PageContainer } from '../../../../components/PageContainer/PageContainer'

export function PatientSickLeaves() {
  const { encryptedPatientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const { data: patient, error } = useGetSickLeavePatientQuery(
    encryptedPatientId
      ? {
          encryptedPatientId,
        }
      : skipToken
  )
  const sickLeaves = patient?.sjukfallList ?? []
  const currentSickLeaves = sickLeaves.filter(({ slut }) => !isDateBeforeToday(slut))
  const earlierSickLeaves = sickLeaves.filter(({ slut }) => isDateBeforeToday(slut))
  const currentSickness = patient?.sjukfallList.find(({ slut }) => !isDateBeforeToday(slut))
  const firstCertificate = currentSickness ? currentSickness.intyg[0] : null
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME

  const { state } = useLocation()

  return (
    <PageContainer>
      <div className="flex justify-between">
        <TableHeadingForUnit tableName="Patientens sjukfall" hideUserSpecifics hideDivider user={user} />
        {!error && (
          <div className="flex justify-end gap-5">
            {currentSickness && firstCertificate && (
              <div className="w-64">
                <SelectRekoStatus
                  endDate={currentSickness.slut}
                  patientId={firstCertificate.patient.id}
                  statusFromSickLeave={state.rekoStatus}
                  rekoStatusTypes={populatedFilters ? populatedFilters.rekoStatusTypes : []}
                />
              </div>
            )}
            <div className="w-96">
              <ModifyPatientTableColumns />
            </div>
          </div>
        )}
      </div>
      {error && <PatientTableError error={error} />}
      {currentSickLeaves.length > 0 && (
        <PatientSickLeavesTable sickLeaves={currentSickLeaves} isDoctor={isDoctor} title="Pågående sjukfall">
          <PatientOverview
            sjfMetaData={patient?.sjfMetaData}
            patientId={firstCertificate ? firstCertificate.patient.id : ''}
            isPersonResponseMissing={
              firstCertificate
                ? firstCertificate.patient.responseFromPu === PuResponse.NOT_FOUND ||
                  firstCertificate.patient.responseFromPu === PuResponse.FOUND_NO_NAME
                : false
            }
            encryptedPatientId={encryptedPatientId || ''}
          />
        </PatientSickLeavesTable>
      )}
      {earlierSickLeaves.length > 0 && (
        <PatientSickLeavesTable sickLeaves={earlierSickLeaves} isDoctor={isDoctor} title="Tidigare sjukfall" />
      )}
    </PageContainer>
  )
}
