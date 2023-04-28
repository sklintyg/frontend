import { IDSButton, IDSContainer, IDSSpinner } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { OverviewStatistics } from './components/OverviewStatistics'
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute'

export function Home() {
  const { isLoading, data: user } = useGetUserQuery()
  const { logout } = useLogout()
  const navigate = useNavigate()
  const sithsUrl = '/saml/login/alias/siths-rs2'

  useEffect(() => {
    if (user && user.valdVardenhet === null) {
      navigate('/enhet')
    }
  }, [user, navigate])

  if (isLoading) {
    return (
      <PageHero icon="user">
        <p className="ids-preamble">
          <IDSSpinner className="inline-block" />
        </p>
      </PageHero>
    )
  }

  return user ? (
    <IDSContainer>
      <ProtectedRoute requireUnit>
        <OverviewStatistics />
      </ProtectedRoute>
    </IDSContainer>
  ) : (
    <PageHero icon="user">
      <h1 className="ids-heading-1">Välkommen till Rehabstöd</h1>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Är du
        rehabkoordinator får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare ser du de pågående sjukfall där du har
        skrivit det senaste intyget.
      </p>
      <IDSButton data-testid="login-btn" onClick={() => window.open(sithsUrl, '_self')}>
        Logga in
      </IDSButton>
    </PageHero>
  )
}
