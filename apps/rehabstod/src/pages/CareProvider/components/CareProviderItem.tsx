import { Heading } from '../../../components/Heading/Heading'
import type { Mottagning, Vardenhet, Vardgivare } from '../../../schemas'
import { CareProviderAccordion } from './CareProviderAccordion'
import { CareProviderRadioButton } from './CareProviderRadio'

export function CareProviderItem({
  provider,
  selectedRadio,
  handleChooseUnit,
}: {
  provider: Vardgivare
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, unit: Vardenhet | Mottagning) => void
}) {
  return (
    <div className="mb-6">
      <Heading level={2} size="xs">
        {provider.namn}
      </Heading>
      {provider.vardenheter.map((unit) => (
        <div key={unit.id}>
          {unit.mottagningar && unit.mottagningar.length > 0 ? (
            <CareProviderAccordion unit={unit} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
              {unit.mottagningar.map((reception) => (
                <div key={reception.id} className="ml-5 flex items-center [&:not(:last-child)]:mb-2">
                  <CareProviderRadioButton
                    id={reception.namn}
                    value={reception.namn}
                    label={reception.namn}
                    checked={selectedRadio === reception.namn}
                    onChange={(event) => handleChooseUnit(event, reception)}
                  />
                </div>
              ))}
            </CareProviderAccordion>
          ) : (
            <div className="my-2 flex items-center border-b border-neutral-90">
              <CareProviderRadioButton
                id={unit.namn}
                value={unit.namn}
                label={unit.namn}
                checked={selectedRadio === unit.namn}
                onChange={(event) => handleChooseUnit(event, unit)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
