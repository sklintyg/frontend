import { Dialog, Heading } from '@frontend/components'
import type { ComponentProps, ReactNode } from 'react'

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
    <Dialog open={open} onOpenChange={onOpenChange} dismissible headline="Vad kan du göra i Intyg" actions={children}>
      <Heading level={2} size="xs">
        Läsa
      </Heading>
      <ul className="mb-5 list-disc pl-10">
        <li> Du kan läsa vad vården skrivit i ditt intyg. Det digitala intyget innehåller samma information som ett intyg på papper.</li>
      </ul>
      <Heading level={2} size="xs">
        Skicka
      </Heading>
      <ul className="mb-5 list-disc pl-10">
        <li>Du kan skicka dina intyg digitalt till Försäkringskassan eller Transportstyrelsen.</li>
        <li>Du kan alltid granska innan du skickar.</li>
      </ul>
      <Heading level={2} size="xs">
        Skriva ut eller spara
      </Heading>
      <ul className="mb-5 list-disc pl-10">
        <li>Du kan skriva ut dina intyg på papper.</li>
        <li>När du klickar på “Skriv ut” kan du välja att spara som dokument (PDF) på din dator.</li>
        <li>Du kan alltid granska innan du skriver ut eller sparar.</li>
        <li>
          En del intyg går inte att skicka här. Till exempel intyg till arbetsgivare. Dessa kan du i stället skriva ut eller spara som
          dokument.
        </li>
      </ul>
      <Heading level={2} size="xs">
        Begränsningar
      </Heading>
      <ul className="mb-5 list-disc pl-10">
        <li>Du kan inte ladda upp egna intyg.</li>
        <li>Du kan bara se dina egna intyg. Intyg har ingen ombudsfunktion.</li>
        <li>Du kan inte begära intyg. Vill du begära intyg behöver du kontakta din mottagning.</li>
      </ul>
    </Dialog>
  )
}
