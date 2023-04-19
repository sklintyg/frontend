import { IDSButton, IDSContainer, IDSSpinner } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'
import { useLogout } from '../../hooks/useLogout'
import { useGetUserQuery } from '../../store/api'
import { OverviewStatistics } from './components/OverviewStatistics'

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
      <OverviewStatistics />
    </IDSContainer>
  ) : (
    <PageHero icon="user">
      <h1 className="ids-heading-1">Välkommen till Rehabstöd</h1>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Här får du en
        överblick över antingen alla pågående sjukfall på din vårdenhet, om du är rehabkoordinator eller alla pågående sjukfall där du
        skrivit det senaste intyget, om du är läkare.
      </p>
      <IDSButton data-testid="login-btn" onClick={() => window.open(sithsUrl, '_self')}>
        Logga in
      </IDSButton>
    </PageHero>
  )
}
