import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetUserQuery } from '../../store/api'
import { useDispatch } from 'react-redux'

export function CareProvider() {
  const dispatch = useDispatch()
  const { data: user } = useGetUserQuery()
  const [isChevronRotated, setIsChevronRotated] = useState(false)

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id
    console.log(unitId)
    // dispatch(setUnit(unitId))
  }

  const handleChevronClick = () => {
    setIsChevronRotated(!isChevronRotated)
  }

  return user ? (
    <div className="grid grid-cols-1 gap-2 my-12">
      <div>
        <h1 className="ids-heading-1 pt-8 pb-4">Välj enhet</h1>
        <p className="ids-preamble my-4">
          Du har behörighet för flera olika enheter. Välj den enhet du vill se pågående <br />
          sjukfall för. Du kan byta enhet även efter inloggning.
        </p>
      </div>
      {user?.vardgivare.map((unit, index) => (
        <React.Fragment key={index}>
          <h3 className="ids-heading-3 text-lg">{unit.namn}</h3>
          {unit.vardenheter.map((provider, pIndex) => (
            <React.Fragment key={pIndex}>
              {provider.mottagningar && provider.mottagningar.length > 0 ? (
                <details>
                  <summary className="flex items-center space-x-2 cursor-pointer" onClick={handleChevronClick}>
                    <IDSIcon name="chevron" className={`w-2 h-2 transform ${isChevronRotated ? 'rotate-180' : 'rotate-90'}`} />
                    {provider.namn}
                  </summary>
                  {provider.mottagningar.map((reception) => (
                    <IDSLink onClick={handleChooseUnit} id={provider.id} className="block pb-2 ml-2">
                      <Link to={provider.id}>{reception.namn}</Link>
                    </IDSLink>
                  ))}
                </details>
              ) : (
                <IDSLink onClick={handleChooseUnit} id={provider.id} className="ml-2">
                  <Link to={provider.id}>{provider.namn}</Link>
                </IDSLink>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  ) : null
}
