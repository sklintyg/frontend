import { IDSFooter, IDSLink } from '@frontend/ids-react-ts'

export function LayoutFooter() {
  return (
    <IDSFooter type="inera-admin" headline="Rehabstöd">
      <p>Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering. </p>
      <p slot="link-col-1">link-col-1</p>
      <p slot="link-col-2">link-col-2</p>
      <p slot="link-col-3">link-col-3</p>
      <p slot="sub-footer-left">Rehabstöd drivs av Inera AB.</p>

      <IDSLink slot="sub-footer-right">
        <a href="//www.inera.se/om-webbplatsen/behandling-av-personuppgifter/" target="_blank" rel="noreferrer">
          Behandling av personuppgifter
        </a>
      </IDSLink>
      <IDSLink slot="sub-footer-right">
        <a href="//www.inera.se/om-webbplatsen/ineras-hantering-av-kakor/" target="_blank" rel="noreferrer">
          Hantering av kakor
        </a>
      </IDSLink>
    </IDSFooter>
  )
}
