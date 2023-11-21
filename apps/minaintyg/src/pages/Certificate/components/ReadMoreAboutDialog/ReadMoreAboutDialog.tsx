import { Dialog } from '@frontend/components'
import { ComponentProps, ReactNode } from 'react'

export function ReadMoreAboutDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  children: ReactNode
  onOpenChange: ComponentProps<typeof Dialog>['onOpenChange']
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} dismissible headline="Vad kan du göra i Intyg">
      <h2 className="ids-heading-4">Läsa</h2>
      <ul className="list-disc pl-10 mb-5">
        <li> Du kan läsa vad vården skrivit i ditt intyg. Det digitala intyget innehåller samma information som ett intyg på papper.</li>
      </ul>
      <h2 className="ids-heading-4">Skicka</h2>
      <ul className="list-disc pl-10 mb-5">
        <li>Du kan skicka dina intyg digitalt till Försäkringskassan eller Transportstyrelsen.</li>
        <li>Du kan alltid granska innan du skickar.</li>
      </ul>
      <h2 className="ids-heading-4">Skriva ut eller spara</h2>
      <ul className="list-disc pl-10 mb-5">
        <li>Du kan skriva ut dina intyg på papper.</li>
        <li>När du klickar på “Skriv ut” kan du välja att spara som dokument (PDF) på din dator.</li>
        <li>Du kan alltid granska innan du skriver ut eller sparar.</li>
        <li>
          En del intyg går inte att skicka här. Till exempel intyg till arbetsgivare. Dessa kan du i stället skriva ut eller spara som
          dokument.
        </li>
      </ul>
      <h2 className="ids-heading-4">Begränsningar</h2>
      <ul className="list-disc pl-10 mb-5">
        <li>Du kan inte ladda upp egna intyg.</li>
        <li>Du kan bara se dina egna intyg. Intyg har ingen ombudsfunktion.</li>
        <li>Du kan inte begära intyg. Vill du begära intyg behöver du kontakta din mottagning.</li>
      </ul>
      {children}
    </Dialog>
  )
}
