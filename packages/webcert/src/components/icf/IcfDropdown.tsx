import React, { useRef, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IcfCategory from './IcfCategory'
import styled from 'styled-components/macro'
import { useSelector } from 'react-redux'
import { getFMBDiagnosisCodes } from '../../store/fmb/fmbSelectors'
import { Icf } from '../../store/icf/icfReducer'

const Root = styled.div`
  position: relative;
  height: 0;
  z-index: 1;
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
`

interface Props {
  infoText: string
  icfData: Icf
  icfCodeValues?: string[]
  onCodeAdd: (icfCodeToAdd: string) => void
  onCodeRemove: (icfCodeToRemove: string) => void
}

const IcfDropdown: React.FC<Props> = ({ infoText, icfData, icfCodeValues, onCodeAdd, onCodeRemove }) => {
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const icdCodes = useSelector(getFMBDiagnosisCodes)
  const rootRef = useRef<null | HTMLElement>(null)

  const getTooltip = () => {
    return icdCodes.length === 0 ? 'Ange minst en diagnos för att få ICF-stöd' : ''
  }

  const handleButtonClick = () => {
    setDisplayDropdown(!displayDropdown)
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
      <CustomButton buttonClasses={'iu-mb-200'} tooltip={getTooltip()} disabled={icdCodes.length === 0} onClick={handleButtonClick}>
        Ta hjälp av ICF
      </CustomButton>
      <Root>
        <div hidden={!displayDropdown} className={'iu-border-black'}>
          <p className={'iu-bg-main iu-color-white  iu-p-300'}>
            <FontAwesomeIcon icon={faInfoCircle} className={'iu-mr-200'} />
            {infoText}
          </p>
          {icfData?.commonCodes && (
            <CategoryWrapper className={'iu-bg-white'}>
              <p>ICF-kategorier gemensamma för:</p>
              <IcfCategory
                icfCodeValues={icfCodeValues}
                icdCodes={icfData.commonCodes.icdCodes}
                icfCodes={icfData.commonCodes.icfCodes}
                onCodeAdd={onCodeAdd}
                onCodeRemove={onCodeRemove}
              />
            </CategoryWrapper>
          )}
          {icfData?.uniqueCodes &&
            icfData.uniqueCodes.map((icfUnique, i) => (
              <CategoryWrapper className={'iu-bg-white'} key={i}>
                <p>ICF-kategorier för:</p>
                <IcfCategory
                  icfCodeValues={icfCodeValues}
                  icdCodes={icfUnique.icdCodes}
                  icfCodes={icfUnique.icfCodes}
                  onCodeAdd={onCodeAdd}
                  onCodeRemove={onCodeRemove}
                />
              </CategoryWrapper>
            ))}
          <Footer className={'iu-bg-secondary-light iu-p-300'}>
            <ButtonWrapper>
              <CustomButton disabled={true} className={'iu-mr-200'}>
                Lägg till
              </CustomButton>
              <CustomButton disabled={true}>Avbryt</CustomButton>
            </ButtonWrapper>
            <a href={'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf'}>
              Läs mer om ICF hos Socialstyrelsenlaunch
            </a>
          </Footer>
        </div>
      </Root>
    </>
  )
}

export default IcfDropdown
