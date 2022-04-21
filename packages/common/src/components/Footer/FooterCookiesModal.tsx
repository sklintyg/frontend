import React from 'react'
import styled from 'styled-components'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'
import externalLinkIcon from '../../images/external_link.svg'

interface Props {
  className?: string
}

const ExternalLinkIconImg = styled.img`
  display: inline;
  top: 2px;
  left: 3px;
  position: relative;
`

export const FooterCookiesModal: React.FC<Props> = ({ className }) => (
  <TextWithInfoModal modalTitle="Om kakor (cookies)" text="Om kakor" additionalStyles={className}>
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
      <a href="https://pts.se/sv/privat/internet/integritet/kakor-cookies/" target="_blank">
        Kommunikationsmyndigheten PTS sida om kakor launch
        <ExternalLinkIconImg src={externalLinkIcon} />
      </a>
      .
    </p>
  </TextWithInfoModal>
)
