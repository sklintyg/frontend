import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../../../../components/PageContainer/PageContainer'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { UserUrval } from '../../../../schemas'
import { PuResponse } from '../../../../schemas/patientSchema'
import { useGetPatientSickLeavesQuery, useGetUserQuery } from '../../../../store/api'
import { isDateBeforeToday } from '../../../../utils/isDateBeforeToday'
import { PatientRekoStatus } from '../PatientRekoStatus'
import { PatientOverview } from '../patientOverview/PatientOverview'
import { ModifyPatientTableColumns } from './ModifyPatientTableColumns'
import { PatientSickLeavesTable } from './PatientSickLeavesTable'

export function PatientSickLeaves() {
  const { encryptedPatientId } = useParams()
  const { data: user } = useGetUserQuery()
  const { data: patient, error } = useGetPatientSickLeavesQuery(
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

  return (
    <PageContainer>
      <div className="flex justify-between">
        <TableHeadingForUnit tableName="Patientens sjukfall" hideUserSpecifics hideDivider user={user} />
        {!error && (
          <div className="flex justify-end gap-5">
            <PatientRekoStatus currentSickLeaves={currentSickLeaves} earlierSickLeaves={earlierSickLeaves} />
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
