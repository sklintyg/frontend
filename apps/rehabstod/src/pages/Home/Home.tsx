import { IDSButton } from '@frontend/ids-react-ts'
import { OverviewStatistics } from './components/OverviewStatistics'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { PageHero } from '../../components/PageHero/PageHero'
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute'
import { useGetConfigQuery, useGetUserQuery } from '../../store/api'

export function Home() {
  const { data: user } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()

  return user ? (
    <ProtectedRoute requireUnit>
      <PageContainer>
        <OverviewStatistics />
      </PageContainer>
    </ProtectedRoute>
  ) : (
    <PageHero type="user">
      <h1 className="ids-heading-1">Välkommen till Rehabstöd</h1>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Är du
        rehabkoordinator får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare ser du de pågående sjukfall där du har
        skrivit det senaste intyget.{' '}
      </p>
      <div className="mb-5 block h-px w-12 bg-neutral-40 md:hidden" />
      <IDSButton sblock data-testid="login-btn" onClick={() => window.open(config && config.sithsIdpUrl, '_self')}>
        Logga in
      </IDSButton>
    </PageHero>
  )
}
