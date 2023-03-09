import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { Link } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'

export function NoMatch() {
  return (
    <PageHero type="error" icon="attention">
      <h1 className="ids-heading-1">Den här sidan hittades inte</h1>
      <p className="ids-preamble">
        Sidan du söker har fått en ny adress eller är borttagen. Inera arbetar löpande med att förbättra struktur och innehåll på
        webbplatsen.
      </p>
      <div className="bg-neutral-40 mb-5 block h-px w-12 md:hidden" />
      <div className="grid grid-cols-1 gap-2 text-left md:inline-grid md:grid-cols-3 md:gap-8">
        <IDSLink>
          <IDSIcon name="chevron" />
          <Link to="/">Till startsidan</Link>
        </IDSLink>
        <IDSLink>
          <IDSIcon name="chevron" />
          <Link to="/">Sök efter sidan</Link>
        </IDSLink>
        <IDSLink>
          <IDSIcon name="chevron" />
          <a href="//www.inera.se/om-inera/" target="_blank" rel="noreferrer">
            Om Inera.se
          </a>
        </IDSLink>
      </div>
    </PageHero>
  )
}
