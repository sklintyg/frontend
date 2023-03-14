import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'

export function NoMatch() {
  return (
    <PageHero type="error" icon="attention">
      <h1 className="ids-heading-1">Den här sidan hittades inte</h1>
      <p className="ids-preamble">Sidan du söker har fått en ny adress eller är borttagen.</p>
      <div className="bg-neutral-40 mb-5 block h-px w-12 md:hidden" />
      <div className="text-center">
        <IDSLink>
          <IDSIcon name="chevron" />
          <Link to="/">Till startsidan</Link>
        </IDSLink>
      </div>
    </PageHero>
  )
}
