import { IDSAlert, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useChangeUnitMutation, useGetUserQuery } from '../../store/api'

export function CareProvider() {
  const navigate = useNavigate()
  const { data: user } = useGetUserQuery()
  const [changeUnit] = useChangeUnitMutation()

  const handleChooseUnit = (event: React.MouseEvent, selectedCareProvider: any, selectedUnit: any) => {
    if (!user) return
    changeUnit({
      vardgivare: selectedCareProvider,
      vardenhet: {
        ...selectedUnit,
        id: event.currentTarget.id,
      },
    })
    navigate('/')
  }

  return user ? (
    <div className="my-16 w-full px-4 md:w-1/2 md:px-0">
      <h1 className="ids-heading-1 pt-8 pb-4">Välj enhet</h1>
      <p className="ids-preamble my-5">
        Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående sjukfall för. Du kan byta enhet även efter inloggning.
      </p>
      {user.roleSwitchPossible && (
        <IDSAlert className="mb-5">
          <span className="items-center flex">
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
                    <IDSIcon name="chevron" className={'w-2 h-2 origin-center rotate-90'} />
                    {unit.namn}
                  </summary>
                  {unit.mottagningar.map((reception) => (
                    <div key={reception.id}>
                      <div onClick={(event) => handleChooseUnit(event, provider, unit)} id={unit.id} className="ml-10 my-2 block">
                        <p className="cursor-pointer">{reception.namn}</p>
                      </div>
                    </div>
                  ))}
                </details>
              ) : (
                <div onClick={(event) => handleChooseUnit(event, provider, unit)} id={unit.id} className="ml-10 my-2 block">
                  <p className="cursor-pointer">{unit.namn}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : null
}
