import { describe, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { ErrorCodeEnum, ErrorTitleEnum } from '../../schemas/errorSchema'
import { DisplayRoutingError } from './DisplayRoutingError'

const renderComponent = (errorCode: string) => {
  renderWithRouter(<DisplayRoutingError errorCode={errorCode} />)
}

describe('DisplayRoutingError tests', () => {
  it('should return LoginError', () => {
    renderComponent(ErrorCodeEnum.enum.LOGIN_FAILED)
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_FAILED)).toBeInTheDocument()
  })
  it('should return HsaError', () => {
    renderComponent(ErrorCodeEnum.enum.LOGIN_HSA_ERROR)
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_HSA_ERROR)).toBeInTheDocument()
  })
  it('should return MissingRoleError', () => {
    renderComponent(ErrorCodeEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL)
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL)).toBeInTheDocument()
  })
  it('should return HsaMissingRole', () => {
    renderComponent(ErrorCodeEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS)
    expect(screen.getByText(ErrorTitleEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS)).toBeInTheDocument()
  })
  it('should return UknownInternalError', () => {
    renderComponent(ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR)
    expect(screen.getByText('Tekniskt fel')).toBeInTheDocument()
  })
})
