import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FocusTrap from 'focus-trap-react'
import { useSelector } from 'react-redux'
import { selectCareProviders } from '../../store/user/userSelectors'

const ModalContentWrapper = styled.div`
  p + p {
    margin-top: 0.25em !important;
  }
`

const WrapText = styled.div`
  white-space: normal;
`

interface Props {
  open: boolean
  title: string
}

const CareProviderModal: React.FC<Props> = ({ open, title }) => {
  //   const [careProvidersArray, setCareProvidersArray] = useState()
  const careProviders = useSelector(selectCareProviders)

  useEffect(() => {
    if (open && careProviders) {
      //  setCareProvidersArray(careProviders.careProviders)
      //console.log(careProviders.careProviders[0].name)
      //   careProviders.careProviders.map((object) => {
      //     setCareProvidersArray(Object.values(object.name).join(''))
      //   })

      careProviders.careProviders.map((careProvider) => {
        console.log('careProvider', careProvider)
      })
    }
  }, [open, careProviders])

  if (!open) {
    return null
  }

  return (
    <>
      <FocusTrap active={open}>
        <div tabIndex={0}>
          <WrapText role="dialog" className="ic-modal" aria-labelledby="dialog-title" aria-modal="true">
            <div className="ic-modal__head" id="demo-modal-content">
              <h3 id="dialog-title">{title}</h3>
            </div>
            <ModalContentWrapper className="ic-modal__body ic-text">
              <a href="#">.</a>
              {careProviders &&
                careProviders.careProviders.map((careProvider) => {
                  console.log(careProvider)
                  return (
                    <details className="ic-expandable" open>
                      <summary className="ic-expandable-button iu-focus">{careProvider.name}</summary>
                      {careProvider.careUnits.map((careUnit) => {
                        return (
                          <p>
                            <a href="">{careUnit.name}</a>
                            {careUnit.units.map((unit) => {
                              return <p>{unit.name}</p>
                            })}
                          </p>
                        )
                      })}
                    </details>
                  )
                })}
            </ModalContentWrapper>
          </WrapText>
        </div>
      </FocusTrap>
    </>
  )
}

export default CareProviderModal
