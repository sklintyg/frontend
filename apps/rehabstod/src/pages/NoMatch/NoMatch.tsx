import { PageHero } from '../../components/PageHero/PageHero'

export function NoMatch() {
  return (
    <PageHero icon="attention">
      <h1 className="ids-heading-1">Den här sidan hittades inte</h1>
      <p className="ids-preamble">Sidan kan ha fått en ny adress eller blivit borttagen.</p>
    </PageHero>
  )
}
