import { IDSIconChevron, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { PageHero } from '../PageHero/PageHero'
import { PageHeroActions } from '../PageHero/PageHeroActions'

export function SessionEnded() {
  return (
    <PageHero heading="Du är utloggad" type="success">
      <p className="ids-preamble">
        Du har antingen valt att logga ut eller blivit utloggad på grund av inaktivitet. Du kan nu stänga fliken eller logga in på nytt.
      </p>
      <PageHeroActions>
        <IDSLink>
          <IDSIconChevron />
          <Link to={import.meta.env.VITE_LOGIN_URL}>Till inloggning</Link>
        </IDSLink>
        <IDSLink>
          <IDSIconChevron />
          <Link to="https://www.1177.se">Till 1177</Link>
          <IDSIconExternal slot="append-icon" />
        </IDSLink>
      </PageHeroActions>
    </PageHero>
  )
}
