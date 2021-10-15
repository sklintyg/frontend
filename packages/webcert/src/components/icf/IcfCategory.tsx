import React from 'react'
import { Icd10Code, IcfCode } from '../../store/icf/icfReducer'
import styled from 'styled-components/macro'
import IcfRow from './IcfRow'

const IcdWrapper = styled.div`
  display: flex;
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
}

const IcfCategory: React.FC<Props> = ({ icd10Codes, icfCodes, icfCodeValues, onAddCode, onRemoveCode }) => {
  const getChecked = (icfCode: string, icfCodeValues?: string[]): boolean => {
    if (!icfCodeValues) return false

    return icfCodeValues.some((code) => code === icfCode)
  }

  const getIcfTitles = () => {
    return (
      <IcdWrapper>
        {icd10Codes.map((code, i) => {
          return (
            <React.Fragment key={i}>
              <strong>{code.title}</strong>
              {icd10Codes.length > 1 && i === 0 && <strong> |</strong>}
            </React.Fragment>
          )
        })}
      </IcdWrapper>
    )
  }

  const getIcfRows = () => {
    return icfCodes.map((icfCode, i) => (
      <IcfRow
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
