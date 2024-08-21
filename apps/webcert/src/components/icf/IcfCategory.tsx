import { isEqual } from 'lodash-es'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { InfoCircle } from '../../images'
import { getOriginalIcd10Codes } from '../../store/icf/icfSelectors'
import { Icd10Code, IcfCode } from '../../types'
import IcfRow from './IcfRow'

const IcdWrapper = styled.div`
  strong {
    margin-top: 0;
    margin-right: 0.25rem;
  }
`

interface Props {
  icd10Codes: Icd10Code[]
  icfCodes: IcfCode[]
  icfCodeValues?: string[]
  onAddCode: (icfCodeToAdd: string) => void
  onRemoveCode: (icfCodeToRemove: string) => void
  parentId: string
}

const IcfCategory: React.FC<Props> = ({ icd10Codes, icfCodes, icfCodeValues, onAddCode, onRemoveCode, parentId }) => {
  const originalIcd10Codes = useSelector(getOriginalIcd10Codes, isEqual)

  const getChecked = (icfCode: string, icfCodeValues?: string[]): boolean => {
    if (!icfCodeValues) return false

    return icfCodeValues.some((code) => code === icfCode)
  }

  const isOriginalIcd10Code = (icd10Code: string) => {
    return originalIcd10Codes.some((code: string) => code === icd10Code)
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [icd10Codes])

  const getIcfTitles = () => {
    return (
      <IcdWrapper>
        {icd10Codes.map((code, i) => {
          return (
            <React.Fragment key={i}>
              <strong>
                {code.title}{' '}
                {!isOriginalIcd10Code(code.code) && (
                  <InfoCircle
                    tooltip={`Det ICF-stöd som visas är för koden ${code.code} - ${code.title}`}
                    testId={'originalWarningIcf'}
                    tabIndex={0}
                  />
                )}
              </strong>
              {icd10Codes.length > 1 && i + 1 !== icd10Codes.length && <strong> |</strong>}
            </React.Fragment>
          )
        })}
      </IcdWrapper>
    )
  }

  const getIcfRows = () => {
    return icfCodes.map((icfCode, i) => (
      <IcfRow
        parentId={parentId}
        checked={getChecked(icfCode.title, icfCodeValues)}
        key={i}
        icfCode={icfCode}
        backgroundStyle={i % 2 === 0 ? '' : 'iu-bg-secondary-light'}
        onCodeAdd={onAddCode}
        onCodeRemove={onRemoveCode}
      />
    ))
  }

  return (
    <>
      {getIcfTitles()}
      <hr />
      <div>{getIcfRows()}</div>
    </>
  )
}

export default IcfCategory
