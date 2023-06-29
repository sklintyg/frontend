import { IDSDialog } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { useGetLinksQuery, useGetUserQuery } from '../../store/api'
import { DynamicLink } from '../DynamicLink/DynamicLink'

export function AboutDialog({ children }: { children: ReactNode }) {
  const { data: user } = useGetUserQuery()
  const { data: links } = useGetLinksQuery()

  return (
    <IDSDialog dismissible headline="Om Rehabstöd">
      {children}
      <div className="ids-content text-base">
        <p className="ids-body">
          Rehabstöd är en tjänst för dig som arbetar med att koordinera rehabiliteringsinsatser för sjukskrivna patienter.{' '}
        </p>
        <p className="ids-body">Nuvarande version är %VERSION%. </p>
        <p className="ids-body">
          Rehabstöd är utvecklat för Chrome och Edge chromium. Andra webbläsare kan användas, men det finns risk att problem kan uppstå.
          Tjänsten kräver att JavaScript är aktiverat.
        </p>

        <h4 className="ids-heading-3">Vad kan jag se i Rehabstöd?</h4>
        <p className="ids-body">
          Är du rehabkoordinator får du en överblick över vårdenhetens alla pågående sjukfall. Är du läkare ser du de pågående sjukfall där
          du har skrivit det senaste intyget.
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
      {user?.features.SRS && (
        <div className="ids-content text-base">
          <h4 className="ids-heading-3">Var kan jag hitta mer information om Stöd för rätt sjukskrivning (SRS)?</h4>
          <p className="ids-body" />
          <p>
            Om du vill se mer information om SRS, t.ex. hur prediktionen räknas ut, fler åtgärder, mer nationell statistik så kan du gå till
            SRS webbplats. När du klickar på länken nedan öppnas SRS webbplats i ett nytt fönster.
          </p>
          {links?.rattsjukskrivning && <DynamicLink link={links.rattsjukskrivning} />}
        </div>
      )}
    </IDSDialog>
  )
}
