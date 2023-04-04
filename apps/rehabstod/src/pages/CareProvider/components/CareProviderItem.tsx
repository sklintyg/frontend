import { Radio } from '../../../components/Form/Radio'
import { Vardenhet, Vardgivare } from '../../../schemas'
import { CareProviderAccordion } from './CareProviderAccordion'

export function CareProviderItem({
  provider,
  selectedRadio,
  handleChooseUnit,
}: {
  provider: Vardgivare
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenhet) => void
}) {
  return (
    <div>
      <h4 className="ids-heading-4 border-neutral-90 my-2 border-b pb-2">{provider.namn}</h4>
      {provider.vardenheter.map((unit) => (
        <div key={unit.id}>
          {unit.mottagningar && unit.mottagningar.length > 0 ? (
            <CareProviderAccordion unit={unit} provider={provider} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
              {unit.mottagningar.map((reception) => (
                <div key={reception.id} className="flex items-center">
                  <Radio
                    name="selectedUnit"
                    value={unit.namn}
                    id={reception.id}
                    onChange={(event) => handleChooseUnit(event, provider, unit)}
                  />
                  <label
                    htmlFor={reception.id}
                    className={`ml-5 cursor-pointer items-center ${selectedRadio === reception.id ? 'font-bold' : ''} m-0`}>
                    {reception.namn}
                  </label>
                </div>
              ))}
            </CareProviderAccordion>
          ) : (
            <div className="flex items-center">
              <div>
                <Radio name="selectedUnit" value={unit.namn} id={unit.id} onChange={(event) => handleChooseUnit(event, provider, unit)} />
              </div>
              <label htmlFor={unit.id} className={` cursor-pointer ${selectedRadio === unit.id ? 'font-bold' : ''} m-0`}>
                {unit.namn}
              </label>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
