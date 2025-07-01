import { IDSIconExternal, IDSLink } from '@inera/ids-react'

export function SupportLink() {
  return (
    <IDSLink underlined>
      <a href="https://www.1177.se/e-tjanster-support" target="_blank" rel="noreferrer">
        support
      </a>
      <IDSIconExternal slot="append-icon" />
    </IDSLink>
  )
}
