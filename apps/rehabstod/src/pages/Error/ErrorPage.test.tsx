import { describe, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorPage } from './ErrorPage'
import { setErrorCode } from '../../store/slices/error.slice'
import { store } from '../../store/store'
import { ErrorCodeEnum, ErrorTitleEnum } from '../../schemas/errorSchema'

const renderComponent = () => {
  renderWithRouter(<ErrorPage />)
}

describe('ErrorPage tests', () => {
  it('should return LoginError', () => {
    store.dispatch(setErrorCode(ErrorCodeEnum.enum.LOGIN_FAILED))
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_FAILED)).toBeInTheDocument()
  })
  it('should return HsaError', () => {
    store.dispatch(setErrorCode(ErrorCodeEnum.enum.LOGIN_HSA_ERROR))
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it('should return MissingRoleError', () => {
    store.dispatch(setErrorCode(ErrorCodeEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL))
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
  it('should return HsaMissingRole', () => {
    store.dispatch(setErrorCode(ErrorCodeEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS))
    renderComponent()
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
  it('should return UknownInternalError', () => {
    store.dispatch(setErrorCode('wrong'))
    renderComponent()
    expect(screen.getByText('Tekniskt fel')).toBeInTheDocument()
  })
})
