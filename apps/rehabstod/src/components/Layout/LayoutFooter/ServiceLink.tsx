import { IDSLink } from '@inera/ids-react'
import { useGetLinksQuery } from '../../../store/api'

export function ServiceLink({ mobile }: { mobile?: boolean }) {
  const { data: links } = useGetLinksQuery()

  return (
    <p>
      Rehabstöd drivs av{' '}
      {links?.ineraMainPage && (
        <IDSLink colorPreset={mobile ? undefined : 4} small underlined>
          <a href={links.ineraMainPage.url} target="_blank" rel="noreferrer">
            {links.ineraMainPage.text}
            <span className="ids-icon-external-link-small ids-icon--text-end" />
          </a>
        </IDSLink>
      )}
    </p>
  )
}
