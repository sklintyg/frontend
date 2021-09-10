import React, { useEffect, useRef, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IcfCategory from './IcfCategory'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import { Icf } from '../../store/icf/icfReducer'
import __ from 'lodash/fp/__'
import _ from 'lodash'

const Root = styled.div`
  position: relative;
  height: 0;
  z-index: 1;
`

const WrapperWithBorder = styled.div`
  // max-height: 400px;
`

const CategoryWrapper = styled.div`
  padding: 0.75rem;
  padding-bottom: 0;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.5em;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
`

const StyledTitle = styled.p`
  position: sticky;
  top: 0;
  z-index: 3;
`

const ScrollDiv = styled.div`
  overflow: auto;
  max-height: 300px;
`

const ValuesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: start;
  flex-wrap: wrap;

  p {
    margin: 0;
  }
`

interface Props {
  infoText: string
  collectionsLabel: string
  icfData?: Icf
  chosenIcfCodeValues?: string[]
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
}

const IcfDropdown: React.FC<Props> = ({ infoText, icfData, chosenIcfCodeValues, onCodeAdd, onCodeRemove, collectionsLabel }) => {
  const icd10Codes = useSelector(getFMBDiagnosisCodes)
  const rootRef = useRef<null | HTMLElement>(null)
  const [displayDropdown, setDisplayDropdown] = useState(false)

  const getTooltip = () => {
    return icd10Codes.length === 0 ? 'Ange minst en diagnos för att få ICF-stöd' : ''
  }

  const handleToggleDropdownButtonClick = () => {
    setDisplayDropdown(!displayDropdown)
  }

  const shouldRenderDropdown = () => {
    return infoText && icfData
  }

  const shouldRenderValues = () => {
    return chosenIcfCodeValues && chosenIcfCodeValues.length > 0 && icd10Codes.length > 0
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
        disabled={icd10Codes.length === 0}
        onClick={handleToggleDropdownButtonClick}>
        Ta hjälp av ICF
      </CustomButton>

      {shouldRenderDropdown() && (
        <>
          <Root>
            <WrapperWithBorder hidden={!displayDropdown} className={'iu-border-black iu-radius-sm'}>
              <StyledTitle className={'iu-bg-main iu-color-white iu-p-300'}>
                <FontAwesomeIcon icon={faInfoCircle} className={'iu-mr-200'} />
                {infoText}
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
            </WrapperWithBorder>
          </Root>
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
      )}
    </>
  )
}

export default IcfDropdown
