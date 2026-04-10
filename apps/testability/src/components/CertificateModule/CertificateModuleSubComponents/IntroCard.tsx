import { IDSCard } from "@inera/ids-react";

export function IntroCard() {
    return (
        <IDSCard className="border-0 shadow-none">
        <span className="ids-preamble">
            Välj först en vårdenhet och sedan det intyg du vill skapa ett ärende för. För att en vårdenhet ska gå att välja i listan så måste det finnas minst ett signerat och skickat intyg på enheten.
        </span>
        </IDSCard>
    )
}