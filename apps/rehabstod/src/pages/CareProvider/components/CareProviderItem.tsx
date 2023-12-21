import { classNames } from '@frontend/components'
import { IDSRadio } from '@frontend/ids-react-ts'
import { Mottagning, Vardenhet, Vardgivare } from '../../../schemas'
import { CareProviderAccordion } from './CareProviderAccordion'

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
      <h2 className="ids-heading-4 my-2 border-b border-neutral-90 pb-2">{provider.namn}</h2>
      {provider.vardenheter.map((unit) => (
        <div key={unit.id}>
          {unit.mottagningar && unit.mottagningar.length > 0 ? (
            <CareProviderAccordion unit={unit} selectedRadio={selectedRadio} handleChooseUnit={handleChooseUnit}>
              {unit.mottagningar.map((reception) => (
                <div key={reception.id} className="ml-5 flex items-center">
                  <IDSRadio>
                    <input
                      type="radio"
                      name="selectedUnit"
                      value={reception.namn}
                      id={reception.namn}
                      checked={selectedRadio === reception.namn}
                      onChange={(event) => handleChooseUnit(event, reception)}
                    />
                    <label
                      htmlFor={reception.namn}
                      className={classNames('cursor-pointer', 'items-center', 'mb-0', selectedRadio === reception.namn && 'font-bold')}
                    >
                      <span className="">{reception.namn}</span>
                    </label>
                  </IDSRadio>
                </div>
              ))}
            </CareProviderAccordion>
          ) : (
            <div className="my-2 flex items-center border-b border-neutral-90">
              <IDSRadio>
                <input
                  type="radio"
                  name="selectedUnit"
                  value={unit.namn}
                  id={unit.namn}
                  checked={selectedRadio === unit.namn}
                  onChange={(event) => handleChooseUnit(event, unit)}
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
