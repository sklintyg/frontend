/* eslint-disable jsx-a11y/label-has-associated-control */
import { IDSIcon, IDSRadio } from '@frontend/ids-react-ts'
import { User, Vardenheter, Vardgivare } from '../../../store/types/user'

export function CareProviderList({
  user,
  selectedRadio,
  handleChooseUnit,
}: {
  user: User
  selectedRadio: string | null
  handleChooseUnit: (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenheter) => void
}) {
  return (
    <>
      {user.vardgivare.map((provider) => (
        <div key={provider.id}>
          <h4 className="ids-heading-4 border-neutral-90 my-2 border-b pb-2">{provider.namn}</h4>
          {provider.vardenheter.map((unit) => (
            <div key={unit.id}>
              {unit.mottagningar && unit.mottagningar.length > 0 ? (
                <details>
                  <summary className="ml-5 flex cursor-pointer items-center space-x-2">
                    <IDSIcon name="chevron" className="h-2 w-2 origin-center rotate-90" />
                    <div className="flex w-full justify-between">
                      <label
                        htmlFor={unit.id}
                        className={`flex cursor-pointer items-center ${
                          selectedRadio === unit.id ? 'font-bold' : ''
                        } w-full justify-between`}>
                        <span>{unit.namn}</span>
                        <IDSRadio>
                          <input
                            type="radio"
                            name="selectedUnit"
                            value={unit.namn}
                            id={unit.id}
                            onChange={(event) => handleChooseUnit(event, provider, unit)}
                          />
                          <label htmlFor={unit.id} />
                        </IDSRadio>
                      </label>
                    </div>
                  </summary>
                  {unit.mottagningar.map((reception) => (
                    <div key={reception.id}>
                      <div className="flex">
                        <label
                          htmlFor={reception.id}
                          className={`ml-10 cursor-pointer ${selectedRadio === reception.id ? 'font-bold' : ''} `}>
                          {reception.namn}
                        </label>
                        <div className="ml-auto">
                          <IDSRadio>
                            <input
                              type="radio"
                              name="selectedUnit"
                              value={unit.namn}
                              id={reception.id}
                              onChange={(event) => handleChooseUnit(event, provider, unit)}
                            />
                            <label htmlFor={reception.id} />
                          </IDSRadio>
                        </div>
                      </div>
                    </div>
                  ))}
                </details>
              ) : (
                <div className="flex items-center justify-between">
                  <label htmlFor={unit.id} className={`ml-10 cursor-pointer ${selectedRadio === unit.id ? 'font-bold' : ''} `}>
                    {unit.namn}
                  </label>
                  <div>
                    <IDSRadio>
                      <input
                        type="radio"
                        name="selectedUnit"
                        value={unit.namn}
                        id={unit.id}
                        onChange={(event) => handleChooseUnit(event, provider, unit)}
                      />
                      <label htmlFor={unit.id} />
                    </IDSRadio>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
