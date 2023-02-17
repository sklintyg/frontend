import { faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CustomButton, InfoCircle, useKeyPress } from '@frontend/common'
import FocusTrap from 'focus-trap-react'
import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { getOriginalIcd10Codes, isIcfFunctionDisabled } from '../../store/icf/icfSelectors'
import IcfCategory from './IcfCategory'
import IcfChosenValues from './IcfChosenValues'
import IcfFooter from './IcfFooter'
import { CategoryWrapper, Root, ScrollDiv } from './Styles'

interface Props {
  modalLabel: string
  collectionsLabel: string
  icfData?: AvailableIcfCodes
  chosenIcfCodeValues?: string[]
  onAddCode: (icfCodeToAdd: string) => void
  onRemoveCode: (icfCodeToRemove: string) => void
  disabled: boolean
  id: string
}

const IcfDropdown: React.FC<Props> = ({
  modalLabel,
  icfData,
  chosenIcfCodeValues,
  onAddCode,
  onRemoveCode,
  collectionsLabel,
  disabled,
  id,
}) => {
  const icd10Codes = useSelector(getOriginalIcd10Codes, _.isEqual)
  const rootRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const btnRef = useRef() as React.RefObject<HTMLButtonElement>
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const functionDisabled = useSelector(isIcfFunctionDisabled)
  const escapePress = useKeyPress('Escape')
  const clickedOutsideDropdown = useCallback(
    (e: Event) => {
      return !rootRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)
    },
    [btnRef, rootRef]
  )

  useEffect(() => {
    if (functionDisabled) {
      setDisplayDropdown(false)
    }
  }, [functionDisabled])

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (clickedOutsideDropdown(e)) {
        setDisplayDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [clickedOutsideDropdown])

  useEffect(() => {
    if (displayDropdown && escapePress) {
      setDisplayDropdown(false)
    }
  }, [escapePress, displayDropdown])

  const getTooltip = () => {
    return icd10Codes.length === 0 ? 'Ange minst en diagnos för att få ICF-stöd.' : ''
  }

  const handleToggleDropdownButtonClick = () => {
    setDisplayDropdown(!displayDropdown)
  }

  const shouldRenderDropdown = (): boolean => {
    return !!modalLabel && !!icfData
  }

  const shouldRenderValues = (): boolean => {
    return !!chosenIcfCodeValues && chosenIcfCodeValues.length > 0
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
      <CategoryWrapper className="iu-bg-white">
        <p>ICF-kategorier gemensamma för:</p>
        <IcfCategory
          parentId={id}
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
      <CategoryWrapper className="iu-bg-white" key={i}>
        <p>ICF-kategorier för:</p>
        <IcfCategory
          parentId={id}
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
        buttonClasses="iu-mb-200"
        tooltip={getTooltip()}
        disabled={shouldDropdownButtonBeDisabled()}
        onClick={handleToggleDropdownButtonClick}>
        <FontAwesomeIcon size="lg" icon={faLightbulb} className="iu-mr-300" />
        Ta hjälp av ICF
        <FontAwesomeIcon icon={faChevronDown} flip={displayDropdown ? 'vertical' : undefined} size="sm" className="iu-ml-200" />
      </CustomButton>
      {shouldRenderDropdown() && displayDropdown && (
        <FocusTrap focusTrapOptions={{ initialFocus: false }}>
          <Root ref={rootRef} id={'icfDropdown-' + id}>
            <div className="iu-border-black iu-radius-sm">
              <p className="iu-bg-main iu-color-white iu-p-300">
                <InfoCircle className="iu-mr-200" />
                {modalLabel}
              </p>
              <ScrollDiv className="iu-pb-300 iu-bg-white" id={'icfScrollContainer-' + id}>
                {getCommonCodes()}
                {getUniqueCodes()}
              </ScrollDiv>
              <IcfFooter handleToggleDropdownButtonClick={handleToggleDropdownButtonClick} />
            </div>
          </Root>
        </FocusTrap>
      )}

      {shouldRenderValues() && <IcfChosenValues collectionsLabel={collectionsLabel} chosenIcfCodeValues={chosenIcfCodeValues} />}
    </>
  )
}

export default IcfDropdown
