import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { TableHeadingForUnit } from '../../../../components/Table/heading/TableHeadingForUnit'
import { PatientTableError } from '../../../../components/error/ErrorAlert/PatientTableError'
import { PuResponse } from '../../../../schemas/patientSchema'
import { useGetUserQuery } from '../../../../store/api'
import { useGetPatientSickLeavesQuery } from '../../../../store/sickLeaveApi'
import { isDateBeforeToday } from '../../../../utils/isDateBeforeToday'
import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { PatientRekoStatus } from '../PatientRekoStatus'
import { PatientAGCertificatesTable } from '../patientAG/PatientAGCertificatesTable'
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
  const isDoctor = user ? isUserDoctor(user) : false

  return (
    <div>
      <TableHeadingForUnit tableName="Patientens sjukfall" hideUserSpecifics hideDivider user={user}>
        {!error && (
          <div className="flex flex-col lg:flex-row lg:justify-end lg:gap-5">
            <PatientRekoStatus currentSickLeaves={currentSickLeaves} earlierSickLeaves={earlierSickLeaves} isDoctor={isDoctor} />
            <div className="lg:w-96">
              <ModifyPatientTableColumns />
            </div>
          </div>
        )}
      </TableHeadingForUnit>
      <PatientAGCertificatesTable />
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
        <PatientSickLeavesTable sickLeaves={earlierSickLeaves} isDoctor={isDoctor} title="Tidigare sjukfall" open={false} />
      )}
    </div>
  )
}
