import { parse } from 'date-fns'

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'yyyy-MM-dd'
const _parseformat = 'yyyyMMdd'

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

export const getValidDate = (dateString: string) => {
  if (_dateReg.test(dateString)) {
    const formattedString = dateString.replace(/-/g, '')
    return parse(formattedString, _parseformat, new Date())
  } else if (_dateRegDashesOptional.test(dateString)) {
    return parse(dateString, _parseformat, new Date())
  }
}
