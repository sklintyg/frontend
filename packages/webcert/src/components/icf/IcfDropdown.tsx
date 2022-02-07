import React, { useEffect, useRef, useState } from 'react'
import { CustomButton } from '@frontend/common'
import { faChevronDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IcfCategory from './IcfCategory'
import { useSelector } from 'react-redux'
import { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { CategoryWrapper, Root, ScrollDiv, StyledTitle } from './Styles'
import { getOriginalIcd10Codes, isIcfFunctionDisabled } from '../../store/icf/icfSelectors'
import IcfFooter from './IcfFooter'
import IcfChosenValues from './IcfChosenValues'
import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import _ from 'lodash'

interface Props {
  modalLabel: string
  collectionsLabel: string
  icfData?: AvailableIcfCodes
  chosenIcfCodeValues?: string[]
  onAddCode: (icfCodeToAdd: string) => void
  onRemoveCode: (icfCodeToRemove: string) => void
  disabled: boolean
}

const IcfDropdown: React.FC<Props> = ({
  modalLabel,
  icfData,
  chosenIcfCodeValues,
  onAddCode,
  onRemoveCode,
  collectionsLabel,
  disabled,
}) => {
  const icd10Codes = useSelector(getOriginalIcd10Codes, _.isEqual)
  const rootRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const btnRef = useRef() as React.RefObject<HTMLButtonElement>
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const functionDisabled = useSelector(isIcfFunctionDisabled)

  useEffect(() => {
    if (functionDisabled) {
      setDisplayDropdown(false)
    }
  }, [functionDisabled])

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  const handleClick = (e: Event) => {
    if (clickedOutsideDropdown(e)) {
      setDisplayDropdown(false)
    }
    return
  }

  const clickedOutsideDropdown = (e: Event) => {
    return !rootRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)
  }

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

  const shouldDropdownButtonBeDisabled = (): boolean => {
    return (
      disabled ||
      icd10Codes.length === 0 ||
      icfData === undefined ||
      icfData.uniqueCodes?.length === 0 ||
      icfData.commonCodes?.icfCodes?.length === 0 ||
      functionDisabled
    )
  }

  const getCommonCodes = () => {
    if (!icfData?.commonCodes.icfCodes) return null

    return (
      <CategoryWrapper className={'iu-bg-white'}>
        <p>ICF-kategorier gemensamma för:</p>
        <IcfCategory
          icfCodeValues={chosenIcfCodeValues}
          icd10Codes={icfData.commonCodes.icd10Codes}
          icfCodes={icfData.commonCodes.icfCodes}
          onAddCode={onAddCode}
          onRemoveCode={onRemoveCode}
        />
      </CategoryWrapper>
    )
  }

  const getUniqueCodes = () => {
    if (!icfData?.uniqueCodes.length) return null

    return icfData.uniqueCodes.map((icfUnique, i) => (
      <CategoryWrapper className={'iu-bg-white'} key={i}>
        <p>ICF-kategorier för:</p>
        <IcfCategory
          icfCodeValues={chosenIcfCodeValues}
          icd10Codes={icfUnique.icd10Codes}
          icfCodes={icfUnique.icfCodes}
          onAddCode={onAddCode}
          onRemoveCode={onRemoveCode}
        />
      </CategoryWrapper>
    ))
  }

  return (
    <>
      <CustomButton
        ref={btnRef}
        buttonClasses={'iu-mb-200'}
        tooltip={getTooltip()}
        disabled={shouldDropdownButtonBeDisabled()}
        onClick={handleToggleDropdownButtonClick}>
        <FontAwesomeIcon size={'lg'} icon={faLightbulb} className={'iu-mr-300'} />
        Ta hjälp av ICF
        <FontAwesomeIcon icon={faChevronDown} flip={displayDropdown ? 'vertical' : undefined} size={'sm'} className={'iu-ml-200'} />
      </CustomButton>

      {shouldRenderDropdown() && (
        <>
          <Root ref={rootRef} id={'icfDropdown'}>
            <div hidden={!displayDropdown} className={'iu-border-black iu-radius-sm'}>
              <StyledTitle className={'iu-bg-main iu-color-white iu-p-300'}>
                <FontAwesomeIcon icon={faInfoCircle} className={'iu-mr-200'} />
                {modalLabel}
              </StyledTitle>
              <ScrollDiv className={'iu-pb-300 iu-bg-white'} id={'icfScrollContainer'}>
                {getCommonCodes()}
                {getUniqueCodes()}
              </ScrollDiv>
              <IcfFooter handleToggleDropdownButtonClick={handleToggleDropdownButtonClick} />
            </div>
          </Root>
        </>
      )}
      {shouldRenderValues() && <IcfChosenValues collectionsLabel={collectionsLabel} chosenIcfCodeValues={chosenIcfCodeValues} />}
    </>
  )
}

export default IcfDropdown
