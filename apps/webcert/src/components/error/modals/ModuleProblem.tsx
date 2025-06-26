import type { ModalProps } from './errorUtils'
import type React from 'react'
import ErrorModalBase from './ErrorModalBase'

export const MODULE_PROBLEM_TITLE = 'Tekniskt fel'
export const MODULE_PROBLEM_MESSAGE = 'Utkastet kunde inte sparas. Om problemet kvarstår, kontakta din lokala IT-administratör.'

const ModuleProblem = ({ errorData }: ModalProps) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{MODULE_PROBLEM_TITLE}</strong>
      </p>
      <p>{MODULE_PROBLEM_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default ModuleProblem
