import { LinkIcon, TertiaryButton } from 'components'
import { IDSIconExternal } from 'ids-react-ts'
import { usePatient } from '../hooks/usePatient'

export function CertificateButton({ certificateId }: { certificateId: string }) {
  const { navigateToWebcert } = usePatient()

  return (
    <TertiaryButton
      onClick={() => {
        navigateToWebcert(certificateId)
      }}
      className="whitespace-nowrap"
      endIcon={<LinkIcon icon={IDSIconExternal} />}
      underlined
    >
      Visa
    </TertiaryButton>
  )
}
