import { Button } from '../../components/Button/Button'
import { Heading } from '../../components/Heading/Heading'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { PageHero } from '../../components/PageHero/PageHero'
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute'
import { useGetConfigQuery, useGetUserQuery } from '../../store/api'
import { OverviewStatistics } from './components/OverviewStatistics'

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
      <Heading size="s" level={1}>
        Välkommen till Rehabstöd
      </Heading>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Har du uppdrag att
        ge koordineringsinsatser på vårdenheten får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare ser du de
        pågående sjukfall där du har skrivit det senaste intyget.
      </p>
      <div className="mb-5 block h-px w-12 bg-neutral-40 md:hidden" />
      <Button sblock data-testid="login-btn" onClick={() => window.open(config && config.sithsIdpUrl, '_self')}>
        Logga in
      </Button>
    </PageHero>
  )
}
