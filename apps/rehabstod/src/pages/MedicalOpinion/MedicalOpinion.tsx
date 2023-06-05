import { IDSContainer } from '@frontend/ids-react-ts'
import { Outlet, useParams } from 'react-router-dom'

export function MedicalOpinion() {
  const { patientId } = useParams()

  if (patientId) {
    return <Outlet />
  }

  return (
    <IDSContainer>
      <div className="ids-content py-10">
        <h1 className="ids-heading-2">Läkarutlåtande</h1>
      </div>
    </IDSContainer>
  )
}
