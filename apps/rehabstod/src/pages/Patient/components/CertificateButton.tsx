import { TertiaryButton } from '@frontend/components'
import { IDSIconExternal } from '@frontend/ids-react-ts'
import { usePatient } from '../hooks/usePatient'

export function CertificateButton({ certificateId }: { certificateId: string }) {
  const { navigateToWebcert } = usePatient()

  return (
    <TertiaryButton
      onClick={() => {
        navigateToWebcert(certificateId)
      }}
      className="whitespace-nowrap"
      endIcon={IDSIconExternal}
    >
      Visa
    </TertiaryButton>
  )
}
