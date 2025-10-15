import { Dialog, Heading } from '@frontend/components'
import { useGetLinksQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateShowCookieDialog } from '../../store/slices/cookieDialog.slice'
import { DynamicLink } from '../DynamicLink/DynamicLink'

export function CookieDialog() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()
  const open = useAppSelector((state) => state.cookieDialog.showCookieDialog)

  return (
    <Dialog dismissible headline="Om kakor (cookies)" open={open} onOpenChange={(state) => dispatch(updateShowCookieDialog(state))}>
      <div className="ids-content text-base">
        <p className="ids-body">
          Vi använder kakor (cookies) för att den här webbplatsen ska fungera på ett bra sätt för dig. Genom att logga in accepterar du vår
          användning av kakor.
        </p>
        <Heading level={2} size="s">
          Så här använder vi kakor
        </Heading>
        <p className="ids-body">
          Den typ av kakor som används på den här webbplatsen kallas för sessionskakor. De lagras temporärt i din dators minne under tiden
          du är inne på webbplatsen. Sessionskakor sparar ingen personlig information om dig, och de försvinner när du stänger din
          webbläsare. I Rehabstöd används sessionskakor för att du ska kunna navigera i tjänsten utan att behöva logga in på nytt varje gång
          du går till en ny sida. De används också för att de filterinställningar du gör ska finnas kvar under hela tiden du är inloggad.
          För att vara säker på att kakorna inte sparas i din dator efter avslutad session måste du stänga webbläsaren när du har loggat ut.
        </p>
        <Heading level={2} size="s">
          Undvika kakor
        </Heading>
        <p className="ids-body">
          Vill du inte acceptera kakor kan din webbläsare ställas in så att du automatiskt nekar till lagring av kakor eller informeras
          varje gång en webbplats begär att få lagra en kaka. Genom webbläsaren kan också tidigare lagrade kakor raderas. Se webbläsarens
          hjälpsidor för mer information. Väljer du att inte acceptera kakor så kan du inte identifiera dig med e-legitimation i denna
          e-tjänst.
        </p>
        <p className="mb-2">Mer information om kakor kan du finna på Kommunikationsmyndigheten PTS sida om kakor </p>
        {links?.ptsCookies && <DynamicLink link={links.ptsCookies} />}
      </div>
    </Dialog>
  )
}
