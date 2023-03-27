import { IDSButton } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'

export function Home() {
  const navigate = useNavigate()

  return (
    <PageHero icon="user">
      <h1 className="ids-heading-1">Välkommen till Rehabstöd</h1>
      <p className="ids-preamble">
        Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter. Här får du en
        överblick över antingen alla pågående sjukfall på din vårdenhet, om du är rehabkoordinator eller alla pågående sjukfall där du
        skrivit det senaste intyget, om du är läkare.
      </p>
      <IDSButton data-testid="login-btn" onClick={() => navigate('/login')}>
        Logga in
      </IDSButton>
    </PageHero>
  )
}
