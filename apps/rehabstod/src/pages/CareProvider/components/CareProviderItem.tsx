import { Radio } from '../../../components/Form/Radio'
import { Vardenheter, Vardgivare } from '../../../store/types/user'
import { CareProviderAccordion } from './CareProviderAccordion'

export function CareProviderItem({
  provider,
  selectedRadio,
  handleChooseUnit,
}: {
  provider: Vardgivare
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenheter) => void
}) {
  return (
    <div>
      <h4 className="ids-heading-4 border-neutral-90 my-2 border-b pb-2">{provider.namn}</h4>
      {provider.vardenheter.map((unit) => (
        <div key={unit.id}>
          {unit.mottagningar && unit.mottagningar.length > 0 ? (
            <CareProviderAccordion unit={unit} provider={provider} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
              {unit.mottagningar.map((reception) => (
                <div key={reception.id}>
                  <div className="flex items-center">
                    <label htmlFor={reception.id} className={`ml-10 cursor-pointer ${selectedRadio === reception.id ? 'font-bold' : ''} `}>
                      {reception.namn}
                    </label>
                    <div className="ml-auto">
                      <Radio
                        name="selectedUnit"
                        value={unit.namn}
                        id={reception.id}
                        onChange={(event) => handleChooseUnit(event, provider, unit)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CareProviderAccordion>
          ) : (
            <div className="flex items-center justify-between">
              <label htmlFor={unit.id} className={`ml-10 cursor-pointer ${selectedRadio === unit.id ? 'font-bold' : ''} `}>
                {unit.namn}
              </label>
              <div>
                <Radio name="selectedUnit" value={unit.namn} id={unit.id} onChange={(event) => handleChooseUnit(event, provider, unit)} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
