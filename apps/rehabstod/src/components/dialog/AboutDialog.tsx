import { useGetConfigQuery, useGetLinksQuery, useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateShowAboutDialog } from '../../store/slices/settings.slice'
import { hasUserFeature } from '../../utils/hasUserFeature'
import { Button } from '../Button/Button'
import { DynamicLink } from '../DynamicLink/DynamicLink'
import { Heading } from '../Heading/Heading'
import { Dialog } from './Dialog'

export function AboutDialog() {
  const { data: user } = useGetUserQuery()
  const { data: links } = useGetLinksQuery()
  const { data: config } = useGetConfigQuery()
  const showAboutDialog = useAppSelector((state) => state.settings.showAboutDialog)
  const dispatch = useAppDispatch()

  return (
    <Dialog open={showAboutDialog} onOpenChange={(open) => dispatch(updateShowAboutDialog(open))} dismissible headline="Om Rehabstöd">
      <div className="ids-content text-base [&:not(:last-child)]:mb-8">
        <p className="ids-body">
          Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter.
        </p>
        {config && <p className="ids-body">Nuvarande version är {config.version}. </p>}
        <p className="ids-body">
          Rehabstöd är utvecklat för Chrome och Edge chromium. Andra webbläsare kan användas, men det finns risk att problem kan uppstå.
          Tjänsten kräver att JavaScript är aktiverat.
        </p>

        <Heading level={2} size="s">
          Vad kan jag se i Rehabstöd?
        </Heading>
        <p className="ids-body">
          Arbetar du med koordineringsinsatser på en vårdenhet får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare
          ser du de pågående sjukfall där du har skrivit det senaste intyget.
        </p>
        <p className="ids-body">
          När du klickar på fliken &quot;Pågående sjukfall&quot; visas pågående sjukfall för den enhet du har loggat in på. För varje
          sjukfall visas patientens personuppgifter, diagnos, sjukskrivningstid, sjukskrivningsgrad med mera. Som rehabkoordinator kan du
          ange i vilken status sjukfallet befinner sig, till exempel kontaktad, aktiv, avslutad eller avböjt.
        </p>
        <p className="ids-body">
          När du klickar på fliken “Läkarutlåtanden” kan du se läkarutlåtanden (FK 7800, FK 7801 och FK 7802) som utfärdats på enheten de
          senaste tre åren.
        </p>
        <p className="ids-body">
          Om du har tillgång till flera enheter kan du byta enhet i genom att klicka på ditt namn högst upp till höger.
        </p>
        <p className="ids-body">Informationen som visas loggas enligt Patientdatalagen (PDL).</p>
      </div>
      {user && hasUserFeature(user, 'SRS') && (
        <div className="ids-content text-base">
          <Heading level={2} size="s">
            Var kan jag hitta mer information om Stöd för rätt sjukskrivning (SRS)?
          </Heading>
          <p className="ids-body" />
          <p>
            Om du vill se mer information om SRS, t.ex. hur prediktionen räknas ut, fler åtgärder, mer nationell statistik så kan du gå till
            SRS webbplats. När du klickar på länken nedan öppnas SRS webbplats i ett nytt fönster.
          </p>
          {links?.rattsjukskrivning && <DynamicLink link={links.rattsjukskrivning} />}
        </div>
      )}
      <div className="ids-body mt-2 flex justify-center">
        <Button sblock onClick={() => dispatch(updateShowAboutDialog(false))}>
          Stäng
        </Button>
      </div>
    </Dialog>
  )
}
