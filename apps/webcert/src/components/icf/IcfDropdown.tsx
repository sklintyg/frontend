import FocusTrap from 'focus-trap-react'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, InfoCircle, LightbulpIcon } from '../../images'
import type { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { getOriginalIcd10Codes, isIcfFunctionDisabled } from '../../store/icf/icfSelectors'
import { useAppSelector } from '../../store/store'
import { useKeyPress } from '../../utils'
import { CustomButton } from '../Inputs/CustomButton'
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

const StyledLightbulpIcon = styled(LightbulpIcon)`
  height: 1rem;
  width: 1rem;
`

const StyledChevronDownIcon = styled(ChevronDownIcon)`
  width: 0.875em;
  font-size: 0.875em;
`

const IcfDropdown = ({ modalLabel, icfData, chosenIcfCodeValues, onAddCode, onRemoveCode, collectionsLabel, disabled, id }: Props) => {
  const icd10Codes = useAppSelector(getOriginalIcd10Codes, isEqual)
  const rootRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const btnRef = useRef() as React.RefObject<HTMLButtonElement>
  const [displayDropdown, setDisplayDropdown] = useState(false)
  const functionDisabled = useAppSelector(isIcfFunctionDisabled)
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
    <FocusTrap
      active={shouldRenderDropdown() && displayDropdown}
      focusTrapOptions={{
        initialFocus: false,
        tabbableOptions: {
          displayCheck: 'none',
        },
      }}
    >
      <div>
        <CustomButton
          ref={btnRef}
          buttonClasses="iu-mb-200"
          tooltip={getTooltip()}
          disabled={shouldDropdownButtonBeDisabled()}
          onClick={handleToggleDropdownButtonClick}
        >
          <StyledLightbulpIcon className="iu-mr-200" />
          Ta hjälp av ICF
          <StyledChevronDownIcon className="iu-ml-200" />
        </CustomButton>
        {shouldRenderDropdown() && displayDropdown && (
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
        )}
        {shouldRenderValues() && <IcfChosenValues collectionsLabel={collectionsLabel} chosenIcfCodeValues={chosenIcfCodeValues} />}
      </div>
    </FocusTrap>
  )
}

export default IcfDropdown
