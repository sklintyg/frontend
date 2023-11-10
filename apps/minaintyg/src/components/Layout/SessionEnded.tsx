import { IDSIconChevron, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import navigation from '../../data/1177-navbar-services.json'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
import { PageHero } from '../PageHero/PageHero'
import { PageHeroActions } from '../PageHero/PageHeroActions'

export function SessionEnded() {
  const linkItem = navigation.menu.items.find(({ name }) => name === 'Start')

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
        {linkItem && (
          <IDSLink>
            <IDSIconChevron />
            <Link to={resolveNavigationUrl(linkItem.url)}>Till 1177</Link>
            <IDSIconExternal slot="append-icon" />
          </IDSLink>
        )}
      </PageHeroActions>
    </PageHero>
  )
}
