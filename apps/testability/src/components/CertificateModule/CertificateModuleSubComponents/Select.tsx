import { IDSContainer, IDSButton } from "@inera/ids-react";
import { IDSSelect } from "@inera/ids-react";

import { useState, useEffect } from "react";
import { getCareUnits } from "@src/api/testabilityServiceApi";
import { CareUnit } from "@src/api/dataFormat";


export function Select() {
    const [careUnits, setCareUnits] = useState<CareUnit[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                const data = await getCareUnits(controller.signal);
                setCareUnits(data);
            } catch (err: unknown) {
                if (err instanceof Error && err.name !== "AbortError") {
                    console.error("Failed to fetch care units:", err);
                }
            }
        }

        load();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <IDSContainer>
            <form noValidate onSubmit={() => { }}>
                <div
                    style={{
                        alignItems: 'flex-end',
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'stretch'
                    }}
                >
                    <div
                        style={{
                            flex: '1'
                        }}
                    >
                        <IDSSelect
                            defaultValue=""
                            errorMsg="This select is required"
                            label="Vårdenhet"
                            name="with-error-message"
                            noValidation
                            required
                        >
                            <>
                                <option disabled value="">
                                    Select an option
                                </option>
                                {careUnits.map((unit) => (
                                    <option key={unit.hsaId} value={unit.hsaId}>
                                        {unit.name}
                                    </option>
                                ))}
                            </>
                        </IDSSelect>
                    </div>
                    <IDSButton
                        size="s"
                        submit
                    >
                        Visa Intyg
                    </IDSButton>
                </div>
            </form>
        </IDSContainer>
    );
}

