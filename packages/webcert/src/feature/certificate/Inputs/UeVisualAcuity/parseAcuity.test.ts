import { parseAcuity } from './parseAcuity'

describe('parseAcuity', () => {
  it('Should only allow digits', () => {
    expect(parseAcuity('abc')).toEqual('')
  })

  it('Should passthrough single digits', () => {
    expect(parseAcuity('1')).toEqual('1')
  })

  it('Should round down to decimal value', () => {
    expect(parseAcuity('11')).toEqual('1,1')
  })

  it('Should keep in-progress inputs', () => {
    expect(parseAcuity('1,')).toEqual('1,')
    expect(parseAcuity('1.')).toEqual('1.')
  })

  it('Should cap input at 99', () => {
    expect(parseAcuity('100')).toEqual('9,9')
  })

  it('Should add decimal when initial character is "0"', () => {
    expect(parseAcuity('01')).toEqual('0,1')
  })
})
