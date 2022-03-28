import * as React from 'react'
import { CustomButton } from '@frontend/common/src/components'
import { useDispatch } from 'react-redux'
import { clearActiveListFilter, performListSearch } from '../../store/list/listActions'
import { ListFilterConfig, ListFilterType, ListFilterValuePersonId, ListFilterValues } from '@frontend/common/src/types/list'
import { isPersonIdValid } from '@frontend/common/src/utils/personIdValidatorUtils'
import styled from 'styled-components/macro'

interface Props {
  searchTooltip: string
  filterConfig: ListFilterConfig[]
  listFilterValues: ListFilterValues | undefined
}

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`

const ListFilterButtons: React.FC<Props> = ({ searchTooltip, filterConfig, listFilterValues }) => {
  const dispatch = useDispatch()

  const onSearch = () => {
    dispatch(performListSearch())
  }

  const onReset = () => {
    dispatch(clearActiveListFilter(filterConfig))
  }

  const isSearchDisabled = () => {
    let hasValidationErrors = false
    if (!listFilterValues) {
      return true
    }
    Object.keys(listFilterValues).map((key) => {
      if (listFilterValues[key].type === ListFilterType.PERSON_ID) {
        const personId = (listFilterValues[key] as ListFilterValuePersonId).value
        hasValidationErrors = personId !== '' && !isPersonIdValid(personId)
      }
    })
    return hasValidationErrors
  }

  return (
    <Wrapper>
      <CustomButton buttonStyle="primary" text="Sök" tooltip={searchTooltip} onClick={onSearch} disabled={isSearchDisabled()} />
      <CustomButton buttonStyle="secondary" text="Återställ sökfiltret" tooltip="Rensa sökfiltret." onClick={onReset} />
    </Wrapper>
  )
}

export default ListFilterButtons
