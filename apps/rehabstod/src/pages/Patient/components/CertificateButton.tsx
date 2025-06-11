import { TertiaryButton } from '../../../components/TertiaryButton/TertiaryButton'
import { usePatient } from '../hooks/usePatient'

export function CertificateButton({ certificateId }: { certificateId: string }) {
  const { navigateToWebcert } = usePatient()

  return (
    <TertiaryButton
      onClick={() => {
        navigateToWebcert(certificateId)
      }}
    >
      Visa
      <span className="ids-icon-external-link-small ids-icon--text-end" />
    </TertiaryButton>
  )
}
