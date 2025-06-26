import type React from 'react'
import styled from 'styled-components'
import ExternalLinkIcon from '../image/image/ExternalLinkIcon'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'

interface Props {
  className?: string
}

const StyledTextWithInfoModal = styled(TextWithInfoModal)`
  @media (max-width: 1024px) {
    flex: 1 0 auto;
    justify-content: flex-start;
    padding: 0.875rem 1.25rem;
    text-align: left;
  }
`

export const FooterCookiesModal = ({ className }: Props) => (
  <StyledTextWithInfoModal modalTitle="Om kakor (cookies)" text="Om kakor (cookies)" className={className}>
    <p>
      Vi använder kakor (cookies) för att den här webbplatsen ska fungera på ett bra sätt för dig. Genom att logga in accepterar du vår
      användning av kakor.
    </p>
    <h3>Så här använder vi kakor</h3>
    <p>
      Den typ av kakor som används på den här webbplatsen kallas för sessionskakor. De lagras temporärt i din dators minne under tiden du är
      inne på webbplatsen. Sessionskakor sparar ingen personlig information om dig, och de försvinner när du stänger din webbläsare.
    </p>
    <p>
      I Webcert används sessionskakor för att du ska kunna navigera i tjänsten utan att behöva logga in på nytt varje gång du går till en ny
      sida. De används också för att de filterinställningar du gör ska finnas kvar under hela tiden du är inloggad. För att vara säker på
      att kakorna inte sparas i din dator efter avslutad session måste du stänga webbläsaren när du har loggat ut.
    </p>
    <h3>Undvika kakor</h3>
    <p>
      Vill du inte acceptera kakor kan din webbläsare ställas in så att du automatiskt nekar till lagring av kakor eller informeras varje
      gång en webbplats begär att få lagra en kaka. Genom webbläsaren kan också tidigare lagrade kakor raderas. Se webbläsarens hjälpsidor
      för mer information.
    </p>
    <p>Väljer du att inte acceptera kakor så kan du inte identifiera dig med e-legitimation i denna e-tjänst.</p>
    <p>
      Mer information om kakor kan du finna på{' '}
      <a href="https://pts.se/sv/privat/internet/integritet/kakor-cookies/" target="_blank" rel="noreferrer">
        Kommunikationsmyndigheten PTS sida om kakor launch
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </a>
      .
    </p>
  </StyledTextWithInfoModal>
)
