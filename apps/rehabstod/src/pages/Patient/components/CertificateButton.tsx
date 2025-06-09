import { IDSIconExternal } from '@inera/ids-react'
import { Button } from '../../../components/Button/Button'
import { usePatient } from '../hooks/usePatient'

export function CertificateButton({ certificateId }: { certificateId: string }) {
  const { navigateToWebcert } = usePatient()

  return (
    <Button
      tertiary
      onClick={() => {
        navigateToWebcert(certificateId)
      }}
    >
      Visa
      <IDSIconExternal />
    </Button>
  )
}
