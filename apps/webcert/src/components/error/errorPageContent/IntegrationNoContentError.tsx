import { ContactSupportMessage } from '../ContactSupportMessage'

export function IntegrationNoContentError() {
  return (
    <>
      <p>
        <strong>Intyget gick inte att läsa in</strong>
      </p>
      <p>
        Intygsutkastet är raderat och kan därför inte längre visas. <ContactSupportMessage />
      </p>
    </>
  )
}
