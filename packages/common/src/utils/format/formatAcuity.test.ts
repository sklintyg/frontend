import { expect, it, describe } from 'vitest'
import { formatAcuity } from './formatAcuity'

describe('formatAcuity', () => {
  it('Should only allow digits', () => {
    expect(formatAcuity('abc')).toEqual('')
  })

  it('Should passthrough single digits', () => {
    expect(formatAcuity('1')).toEqual('1')
  })

  it('Should round down to decimal value', () => {
    expect(formatAcuity('11')).toEqual('1,1')
  })

  it('Should keep in-progress inputs', () => {
    expect(formatAcuity('1,')).toEqual('1,')
    expect(formatAcuity('1.')).toEqual('1,')
  })

  it('Should format to sv-SE locale', () => {
    expect(formatAcuity('1.1')).toEqual('1,1')
  })

  it('Should cap input at 99', () => {
    expect(formatAcuity('100')).toEqual('9,9')
  })

  it('Should add decimal when initial character is "0"', () => {
    expect(formatAcuity('01')).toEqual('0,1')
  })
})
