import React, { useEffect, useRef, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IcfCategory from './IcfCategory'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import { Icf } from '../../store/icf/icfReducer'
import { ButtonWrapper, CategoryWrapper, Footer, Root, ScrollDiv, StyledTitle, ValuesWrapper } from './Styles'
import { getIsLoadingIcfData } from '../../store/icf/icfSelectors'

interface Props {
  modalLabel: string
  collectionsLabel: string
  icfData?: Icf
  chosenIcfCodeValues?: string[]
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
  disabled: boolean
}

const IcfDropdown: React.FC<Props> = ({
  modalLabel,
  icfData,
  chosenIcfCodeValues,
  onCodeAdd,
  onCodeRemove,
  collectionsLabel,
  disabled,
}) => {
  const icd10Codes = useSelector(getFMBDiagnosisCodes)
  const rootRef = useRef<null | HTMLElement>(null)
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const loadingIcfData = useSelector(getIsLoadingIcfData())

  useEffect(() => {
    if (loadingIcfData) {
      setDisplayDropdown(false)
    }
  }, [loadingIcfData])

  const getTooltip = () => {
    return icd10Codes.length === 0 ? 'Ange minst en diagnos för att få ICF-stöd' : ''
  }

  const handleToggleDropdownButtonClick = () => {
    setDisplayDropdown(!displayDropdown)
  }

  const shouldRenderDropdown = () => {
    return modalLabel && icfData
  }

  const shouldRenderValues = () => {
    return chosenIcfCodeValues && chosenIcfCodeValues.length > 0
  }

  const getDropdownButtonBeDisabled = (): boolean => {
    return disabled || icd10Codes.length === 0 || icfData === undefined || loadingIcfData
  }

  /*function useOutsideAlerter(ref: null | React.MutableRefObject<HTMLElement>) {
    useEffect(() => {
     
      function handleClickOutside(event) {
        if (ref?.current && !ref.current.contains(event.target)) {
          alert("You clicked outside of me!");
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  } */

  return (
    <>
      <CustomButton
        buttonClasses={'iu-mb-200'}
        tooltip={getTooltip()}
        disabled={getDropdownButtonBeDisabled()}
        onClick={handleToggleDropdownButtonClick}>
        Ta hjälp av ICF
      </CustomButton>

      {shouldRenderDropdown() && (
        <>
          <Root>
            <div hidden={!displayDropdown} className={'iu-border-black iu-radius-sm'}>
              <StyledTitle className={'iu-bg-main iu-color-white iu-p-300'}>
                <FontAwesomeIcon icon={faInfoCircle} className={'iu-mr-200'} />
                {modalLabel}
              </StyledTitle>
              <ScrollDiv className={'iu-pb-300 iu-bg-white'}>
                {icfData?.commonCodes.icfCodes && (
                  <CategoryWrapper className={'iu-bg-white'}>
                    <p>ICF-kategorier gemensamma för:</p>
                    <IcfCategory
                      icfCodeValues={chosenIcfCodeValues}
                      icdCodes={icfData.commonCodes.icdCodes}
                      icfCodes={icfData.commonCodes.icfCodes}
                      onCodeAdd={onCodeAdd}
                      onCodeRemove={onCodeRemove}
                    />
                  </CategoryWrapper>
                )}
                {icfData?.uniqueCodes.length &&
                  icfData.uniqueCodes.map((icfUnique, i) => (
                    <CategoryWrapper className={'iu-bg-white'} key={i}>
                      <p>ICF-kategorier för:</p>
                      <IcfCategory
                        icfCodeValues={chosenIcfCodeValues}
                        icdCodes={icfUnique.icdCodes}
                        icfCodes={icfUnique.icfCodes}
                        onCodeAdd={onCodeAdd}
                        onCodeRemove={onCodeRemove}
                      />
                    </CategoryWrapper>
                  ))}
              </ScrollDiv>
              <Footer className={'iu-bg-secondary-light iu-p-300'}>
                <ButtonWrapper>
                  <CustomButton className={'iu-mr-200'} onClick={handleToggleDropdownButtonClick}>
                    Stäng
                  </CustomButton>
                </ButtonWrapper>
                <a href={'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf'}>
                  Läs mer om ICF hos Socialstyrelsenlaunch
                </a>
              </Footer>
            </div>
          </Root>
        </>
      )}
      {shouldRenderValues() && (
        <div className={'iu-p-300 iu-bg-grey-200 iu-mt-200 iu-mb-300'}>
          <p className={'iu-mb-200'}>{collectionsLabel}</p>
          <ValuesWrapper>
            {chosenIcfCodeValues?.map((code) => (
              <p key={code} className={'iu-bg-white iu-p-200 iu-fs-200 iu-radius-sm iu-border-black'}>
                {code}
              </p>
            ))}
          </ValuesWrapper>
        </div>
      )}
    </>
  )
}

export default IcfDropdown
