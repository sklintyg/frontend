import { useParams } from 'react-router-dom'
import { useGetUserQuery } from '../../store/api'
import { PatientHeader } from './components/PatientHeader'

export function CurrentSickLeavesPatient() {
  const { patientId } = useParams()
  const { data: user } = useGetUserQuery()

  if (!patientId) {
    return null
  }

  return (
    <>
      <PatientHeader patientId={patientId} />
      <div className="ids-content py-10">
        <h1 className="ids-heading-2">Pågående sjukfall på {user?.valdVardenhet?.namn}</h1>
      </div>
    </>
  )
}
