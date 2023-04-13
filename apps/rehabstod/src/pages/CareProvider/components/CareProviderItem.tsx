import { IDSRadio } from '@frontend/ids-react-ts'
import { Vardenhet, Vardgivare } from '../../../schemas'
import { classNames } from '../../../utils/classNames'
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
                  <IDSRadio>
                    <input
                      type="radio"
                      name="selectedUnit"
                      value={unit.namn}
                      id={reception.namn}
                      onChange={(event) => handleChooseUnit(event, provider, unit)}
                    />
                    <label
                      htmlFor={reception.namn}
                      className={classNames('cursor-pointer', 'items-center', selectedRadio === reception.namn && 'font-bold')}>
                      <span className="ml-5"> {reception.namn}</span>
                    </label>
                  </IDSRadio>
                </div>
              ))}
            </CareProviderAccordion>
          ) : (
            <div className="flex items-center">
              <IDSRadio>
                <input
                  type="radio"
                  name="selectedUnit"
                  value={unit.namn}
                  id={unit.namn}
                  onChange={(event) => handleChooseUnit(event, provider, unit)}
                />
                <label htmlFor={unit.namn} className={` cursor-pointer ${selectedRadio === unit.namn ? 'font-bold' : ''}`}>
                  {unit.namn}
                </label>
              </IDSRadio>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
