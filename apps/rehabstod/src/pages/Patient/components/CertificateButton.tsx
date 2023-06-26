import { IDSButton, IDSIconExternal } from '@frontend/ids-react-ts'
import { usePatient } from '../hooks/usePatient'

export function CertificateButton({ certificateId }: { certificateId: string }) {
  const { navigateToWebcert } = usePatient()

  return (
    <IDSButton
      tertiary
      onClick={() => {
        navigateToWebcert(certificateId)
      }}
      className="whitespace-nowrap"
    >
      Visa
      <IDSIconExternal height="16" width="16" className="ml-2 inline align-middle" />
    </IDSButton>
  )
}
