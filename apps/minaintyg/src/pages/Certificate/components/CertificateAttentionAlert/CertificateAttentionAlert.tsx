import { IDSAlert } from 'ids-react-ts'
import type { AvailableFunction } from '../../../../schema/certificate.schema'
import { AvailableFunctionsTypeEnum } from '../../../../schema/certificate.schema'

export function CertificateAttentionAlert({ availableFunctions }: { availableFunctions: AvailableFunction[] }) {
  const infoFunction = availableFunctions.find((availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.ATTENTION)

  if (!infoFunction) {
    return null
  }

  return (
    <div className="mb-5">
      <IDSAlert key={infoFunction.name} role="alert" type="attention" headline={infoFunction.title || ''}>
        {infoFunction.body}
      </IDSAlert>
    </div>
  )
}
