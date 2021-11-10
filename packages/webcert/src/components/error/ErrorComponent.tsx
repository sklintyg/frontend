import React from 'react'
import { useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)

  return null
}

export default ErrorComponent
