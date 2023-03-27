import { IDSButton, IDSSpinner } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'
import { useLogout } from '../../hooks/useLogout'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'

export function Home() {
  const { isLoading, data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const { logout } = useLogout()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.valdVardenhet === null) {
      const vardgivare = user.vardgivare[0]
      const vardenhet = vardgivare.vardenheter[0]
      changeUnit({ vardgivare, vardenhet })
    }
  }, [changeUnit, user])

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
    <PageHero icon="user">
      <p className="ids-preamble">Hej {user.namn}</p>

      <p className="ids-body">Vårdgivare: {user.valdVardgivare?.namn}</p>
      <p className="ids-body">Vårdenhet: {user.valdVardenhet?.namn}</p>

      <IDSButton type="submit" onclick={logout}>
        Logga ut
      </IDSButton>
    </PageHero>
  ) : (
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
