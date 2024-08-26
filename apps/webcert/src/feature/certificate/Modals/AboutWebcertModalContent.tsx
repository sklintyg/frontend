import type React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getConfig } from '../../../store/utils/utilsSelectors'
import WCDynamicLink from '../../../utils/WCDynamicLink'

const Wrapper = styled.div`
  p,
  h4 {
    padding-bottom: 10px;
  }
`

const AboutWebcertModalContent: React.FC = () => {
  const { version } = useSelector(getConfig, shallowEqual)

  return (
    <Wrapper>
      <p className={'iu-pt-400'}>Webcert är en tjänst som drivs av Inera AB.</p>

      <p>Nuvarande version är {version}.</p>

      <p>Webcert är utvecklat för senaste versionen av webbläsare Edge Chromium och Chrome. </p>
      <p>
        För att kunna generera utskrifter av intygen använder sig Webcert av <WCDynamicLink linkKey={'iText7'} />. För mer information under
        vilka villkor iText7 får användas läs mer om AGPL 3.0 på <WCDynamicLink linkKey={'agpl3'} />. För Webcerts källkod besök{' '}
        <WCDynamicLink linkKey={'github'} />. För Webcerts upphovsrättslicens besök {<WCDynamicLink linkKey={'github'} />}.
      </p>

      <p className={'iu-fw-bold'}>Behandling av personuppgifter</p>
      <p>
        Inera behandlar personuppgifter som personuppgiftsansvarig för det egna bolagets verksamhet och i sin roll som personuppgiftsbiträde
        för regioner och kommuner. Inera värnar om den personliga integriteten och eftersträvar alltid en hög nivå av dataskydd.
      </p>

      <p>
        Läs mer om hur personuppgifter behandlas på <WCDynamicLink linkKey={'ineraPersonuppgifter'} />.
      </p>

      <p className={'iu-fw-bold'}>Användandet av kakor (cookies)</p>
      <p>
        Vi använder kakor (cookies) för att den här webbplatsen ska fungera på ett bra sätt för dig. Genom att logga in accepterar du vår
        användning av kakor.
      </p>

      <p>
        Webcert använder så kallade sessionskakor. De lagras temporärt i din dators minne under tiden du är inne på webbplatsen.
        Sessionskakor sparar ingen personlig information om dig och de försvinner när du stänger din webbläsare. De säkerställer att du kan
        navigera i tjänsten utan att behöva logga in på nytt varje gång du går till en ny sida. De används också för att de
        filtrerinställningar du gör finns kvar under tiden du är inloggad. För att vara säker på att kakorna inte sparas i din dator efter
        avslutad session måste du stänga webbläsaren när du har loggat ut.
      </p>

      <p>
        Om du inte accepterar användningen av kakor kan du ställa in din webbläsare så att kakor blockeras. Väljer du att inte acceptera
        kakor kan du inte identifiera dig med e-legitimation i denna e-tjänst.
      </p>

      <p>
        Mer information om kakor finns på <WCDynamicLink linkKey={'ptsCookiesBanner'} />
      </p>

      <p className={'iu-fw-bold'}>Kontakt och support</p>
      <p>
        Tekniska frågor och frågor om användning av Webcert hanteras i första hand av din lokala IT- och supportorganisation. Om din lokala
        support inte kan besvara din fråga ska de i sin tur kontakta <WCDynamicLink linkKey={'ineraNationellaKundservice'} />.
      </p>

      <p>
        Vid frågor gällande inloggning och signering med e-legitimation kontakta din lokala IT- och supportorganisation alternativt din
        leverantör av e-legitimation.
      </p>

      <p>
        Har du som användare synpunkter på tjänsten kan du kontakta <WCDynamicLink linkKey={'ineraNationellaKundservice'} />.
      </p>

      <p>
        Inera AB <br />
        Box 17703 <br />
        118 93 Stockholm <br />
        Organisationsnummer: 556559-4230
      </p>
    </Wrapper>
  )
}

export default AboutWebcertModalContent
