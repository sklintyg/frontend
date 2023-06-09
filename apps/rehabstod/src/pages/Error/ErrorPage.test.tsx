import { describe, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { ErrorCode, ErrorTitle } from '../../error/ErrorCode'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorPage } from './ErrorPage'
import { setErrorCode } from '../../store/slices/error.slice'
import { store } from '../../store/store'

const renderComponent = () => {
  renderWithRouter(<ErrorPage />)
}

describe('ErrorPage tests', () => {
  it('should return LoginError', () => {
    store.dispatch(setErrorCode(ErrorCode.LOGIN_FAILED))
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_FAILED)).toBeInTheDocument()
  })
  it('should return HsaError', () => {
    store.dispatch(setErrorCode(ErrorCode.LOGIN_HSA_ERROR))
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it('should return MissingRoleError', () => {
    store.dispatch(setErrorCode(ErrorCode.LOGIN_SAKNAR_HSA_REHABROLL))
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
  it('should return HsaMissingRole', () => {
    store.dispatch(setErrorCode(ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS))
    renderComponent()
    expect(screen.getByText(ErrorTitle.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
  it('should return UknownInternalError', () => {
    store.dispatch(setErrorCode('wrong'))
    renderComponent()
    expect(screen.getByText('Tekniskt fel')).toBeInTheDocument()
  })
})
