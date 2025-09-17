import { debounce, isEqual } from 'lodash-es'
import { useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../store/store'
import { getDiagnosisTypeahead, resetDiagnosisTypeahead as resetDiagnosisTypeaheadAction } from '../../../../../store/utils/utilsActions'
import { getDiagnosisTypeaheadResult } from '../../../../../store/utils/utilsSelectors'
import type { Diagnosis, ValueDiagnosis } from '../../../../../types'

const MAX_NUMBER_OF_TYPEAHEAD_RESULTS = 18
const MIN_CODE_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 1
const DIAGNOSIS_DIVIDER = '|'

const isShortPsychologicalDiagnosis = (code: string) => {
  const isPsychologicalDiagnosis = code.slice(0, 3) === 'Z73' || code.slice(0, 1) === 'F'
  return code.length < 4 && isPsychologicalDiagnosis
}

export const getDiagnosisParts = (diagnosis: string) => {
  const [code, description] = diagnosis.indexOf(DIAGNOSIS_DIVIDER)
    ? diagnosis.split(DIAGNOSIS_DIVIDER).map((val) => val.trim())
    : [diagnosis, diagnosis]
  return { code, description }
}

export const getDiagnosisItemText = (item: string, value: string | number | readonly string[] | undefined) => {
  if (value !== undefined) {
    const { code, description } = getDiagnosisParts(item)
    const regex = new RegExp(
      `(${String(value)
        .replace(/\\/g, '\\\\')
        .replace(/([()[\]])/g, '\\$1')})`,
      'ig'
    )
    return `${code} ${DIAGNOSIS_DIVIDER} ${description.replace(regex, '<span class="iu-fw-bold">$1</span>')}`
  } else return item
}

export function useDiagnosisTypeahead({ list }: { list: ValueDiagnosis[] }) {
  const dispatch = useAppDispatch()
  const typeaheadResult = useAppSelector(getDiagnosisTypeaheadResult(), isEqual)
  const suggestions = useMemo(
    () =>
      (typeaheadResult?.diagnoser ?? [])
        .filter((diagnosis) => {
          return !list.find((value) => value.code === diagnosis.kod)
        })
        .map((diagnosis: Diagnosis) => {
          const isDisabled = isShortPsychologicalDiagnosis(diagnosis.kod)
          return {
            label: `${diagnosis.kod} ${DIAGNOSIS_DIVIDER} ${diagnosis.beskrivning}`,
            disabled: isDisabled,
            title: isDisabled ? 'Diagnoskod måste anges på fyrställig nivå' : null,
          }
        }) ?? [],
    [list, typeaheadResult?.diagnoser]
  )

  const updateTypeaheadResult = useRef(
    debounce((searched: string, isCode: boolean, selectedCodeSystem: string) => {
      if (
        searched !== undefined &&
        ((isCode && searched.length >= MIN_CODE_LENGTH) || (!isCode && searched.length >= MIN_DESCRIPTION_LENGTH))
      ) {
        dispatch(
          getDiagnosisTypeahead({
            codeSystem: selectedCodeSystem,
            fragment: searched,
            code: isCode,
            maxNumberOfResults: MAX_NUMBER_OF_TYPEAHEAD_RESULTS,
          })
        )
      } else if (typeaheadResult !== null) {
        dispatch(resetDiagnosisTypeahead())
      }
    }, 150)
  ).current

  const resetDiagnosisTypeahead = () => dispatch(resetDiagnosisTypeaheadAction())

  return { suggestions, moreResults: typeaheadResult?.moreResults, updateTypeaheadResult, resetDiagnosisTypeahead }
}
