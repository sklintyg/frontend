import { IDSContainer, IDSIconChevron, IDSLink } from '@inera/ids-react'
import { Link } from 'react-router-dom'
import { Heading } from '../../components/Heading/Heading'
import { PageHero } from '../../components/PageHero/PageHero'

export function NoMatch() {
  return (
    <IDSContainer>
      <PageHero type="error">
        <Heading level={1} size="l">
          Den här sidan hittades inte
        </Heading>
        <p className="ids-preamble">Sidan du söker har fått en ny adress eller är borttagen.</p>
        <div className="mb-5 block h-px w-12 bg-neutral-40 md:hidden" />
        <div className="text-center">
          <IDSLink>
            <IDSIconChevron />
            <Link to="/">Till startsidan</Link>
          </IDSLink>
        </div>
      </PageHero>
    </IDSContainer>
  )
}
