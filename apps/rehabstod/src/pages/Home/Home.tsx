import { IDSButton } from '@frontend/ids-react-ts'
import { PageHero } from '../../components/PageHero/PageHero'
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute'
import { useGetUserQuery } from '../../store/api'
import { OverviewStatistics } from './components/OverviewStatistics'

export function Home() {
  const { data: user } = useGetUserQuery()
  const sithsUrl = '/saml/login/alias/siths-rs2'

  return user ? (
    <ProtectedRoute requireUnit>
      <OverviewStatistics />
    </ProtectedRoute>
  ) : (
    <PageHero type="user">
      <h1 className="ids-heading-1">Välkommen till Rehabstöd</h1>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Är du
        rehabkoordinator får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare ser du de pågående sjukfall där du har
        skrivit det senaste intyget.
      </p>
      <div className="bg-neutral-40 mb-5 block h-px w-12 md:hidden" />
      <IDSButton data-testid="login-btn" onClick={() => window.open(sithsUrl, '_self')}>
        Logga in
      </IDSButton>
    </PageHero>
  )
}
