import { LinkWithDialog } from '../../../../../components/LinkWithDialog/LinkWithDialog'

export function AboutConsentDialog() {
  return (
    <LinkWithDialog title="Om samtycke">
      <div>
        <p>För att ta del av uppgifter via sammanhållen journalföring behöver du ha</p>
        <ul>
          <li>Dels en pågående vårdrelation med patienten</li>
          <li>Dels patientens samtycke</li>
        </ul>
        <p>Samtycket kan ha getts muntligen eller skriftligen.</p>
      </div>
    </LinkWithDialog>
  )
}
