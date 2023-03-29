import { IDSAlert, IDSButton, IDSButtonGroup, IDSIcon, IDSRadio } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'
import { Vardenheter, Vardgivare } from '../../store/types/user'

export function CareProvider() {
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()
  const [selectedUnit, setSelectedUnit] = useState<Vardenheter | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Vardgivare | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null)

  const handleClick = () => {
    if (!user || !selectedUnit || !selectedProvider) return

    changeUnit({
      vardgivare: selectedProvider,
      vardenhet: {
        ...selectedUnit,
        id: selectedUnit.id,
      },
    })
    navigate('/')
  }

  const handleChooseUnit = (event: React.ChangeEvent<HTMLInputElement>, provider: Vardgivare, unit: Vardenheter) => {
    setSelectedProvider(provider)
    setSelectedUnit(unit)
    setSelectedRadio(event.target.id)
  }

  return user ? (
    <div className="my-16 w-full px-4 md:w-1/2 md:px-0">
      <div className="mb-7">
        <h1 className="ids-heading-1 pt-8 pb-4">Välj enhet</h1>
        <p className="ids-preamble my-5">
          Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående sjukfall för. Du kan byta enhet även efter
          inloggning.
        </p>
        {user.roleSwitchPossible && (
          <IDSAlert className="mb-5">
            <span className="flex items-center">
              Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från Läkare
              till Rehabkoordinator när du väljer att logga in på en sådan enhet.
            </span>
          </IDSAlert>
        )}
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
      </div>

      <IDSButtonGroup>
        <IDSButton disabled>Avbryt</IDSButton>
        <IDSButton onClick={handleClick}>Välj</IDSButton>
      </IDSButtonGroup>
    </div>
  ) : null
}
