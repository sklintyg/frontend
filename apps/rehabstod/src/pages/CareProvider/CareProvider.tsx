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
    <div className="w-full md:w-1/2 px-4 md:px-0 my-16">
      <h1 className="ids-heading-1 pt-8 pb-4">Välj enhet</h1>
      <p className="ids-preamble my-5">
        Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående sjukfall för. Du kan byta enhet även efter inloggning.
      </p>
      {user.roleSwitchPossible && (
        <IDSAlert className="mb-5">
          <span className="flex items-cemter">
            Du har behörigheten Rehabkoordinator på någon/några av dina enheter. Var uppmärksam om att din roll kommer skifta från Läkare
            till Rehabkoordinator när du väljer att logga in på en sådan enhet.
          </span>
        </IDSAlert>
      )}
      {user.vardgivare.map((provider, index) => (
        <div key={index}>
          <h4 className="ids-heading-4 my-2 pb-2 border-b border-neutral-90">{provider.namn}</h4>
          {provider.vardenheter.map((unit, pIndex) => (
            <div key={pIndex}>
              {unit.mottagningar && unit.mottagningar.length > 0 ? (
                <details>
                  <summary className="flex items-center space-x-2 cursor-pointer ml-5">
                    <IDSIcon name="chevron" className={`w-2 h-2 origin-center transform rotate-90`} />
                    {unit.namn}
                  </summary>
                  {unit.mottagningar.map((reception) => (
                    <IDSLink onClick={(event) => handleChooseUnit(event, provider, unit)} id={unit.id} className="block ml-10 my-2">
                      <Link to="">{reception.namn}</Link>
                    </IDSLink>
                  ))}
                </details>
              ) : (
                <IDSLink onClick={(event) => handleChooseUnit(event, provider, unit)} id={unit.id} className="block ml-10 my-2">
                  <Link to="">{unit.namn}</Link>
                </IDSLink>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : null
}
