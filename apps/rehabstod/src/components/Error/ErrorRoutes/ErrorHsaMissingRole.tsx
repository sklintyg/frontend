import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'

export function ErrorHsaMissingRole() {
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL} </h1>
      <p className="ids-preamble">{ErrorTextEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL}</p>
    </>
  )
}
