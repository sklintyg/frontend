import { useGetAppConfigQuery, useGetCertificateDescriptionQuery } from '../../store/configApi'

export function Home() {
  const { data: config } = useGetAppConfigQuery()
  const { data: certificateDescription } = useGetCertificateDescriptionQuery()
  return <p>Start</p>
}
