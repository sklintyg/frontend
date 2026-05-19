import { Icon } from '@frontend/components'
import { IDSLink } from '@inera/ids-react'
import { useGetLinksQuery } from '../../../store/api'

export function ServiceLink({ mobile }: { mobile?: boolean }) {
  const { data: links } = useGetLinksQuery()

  return (
    <p>
      Rehabstöd drivs av{' '}
      {links?.ineraMainPage && (
        <IDSLink colorPreset={3} small underlined>
          <a href={links.ineraMainPage.url} target="_blank" rel="noreferrer">
            {links.ineraMainPage.text}
            <Icon icon="external-link-small" textEnd />
          </a>
        </IDSLink>
      )}{' '}
      på uppdrag av Sveriges regioner
    </p>
  )
}
