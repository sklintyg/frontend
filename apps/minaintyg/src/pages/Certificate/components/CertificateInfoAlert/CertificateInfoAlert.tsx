import { IDSAlert } from '@frontend/ids-react-ts'
import { AvailableFunction, AvailableFunctionsTypeEnum } from '../../../../schema/certificate.schema'

export function CertificateInfoAlert({ availableFunctions }: { availableFunctions: AvailableFunction[] }) {
  const infoFunction = availableFunctions.find((availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.INFO)

  if (!infoFunction) {
    return null
  }

  return (
    <div className="mb-5">
      <IDSAlert key={infoFunction.name} type="info" headline={infoFunction.title || ''}>
        {infoFunction.body}
      </IDSAlert>
    </div>
  )
}
