import { IDSAlert } from "@inera/ids-react";

export function Infobox () {
    return (
        <IDSAlert type="info">
            <p>Här kan du välja en enhet och få alla intyg som skickats därifrån listade. Efter att du valt ett intyg kan du skapa ett ärende eller fortsätta på en befintlig ärendetråd.</p>
        </IDSAlert>
    )
}