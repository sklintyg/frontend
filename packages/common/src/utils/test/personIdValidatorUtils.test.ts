import { isPersonIdValid } from '../personIdValidatorUtils'

describe('patientIdValidatorUtils', () => {
  it('should validate as false if person id includes letters', () => {
    expect(isPersonIdValid('ååååmmddnnnn')).toBeFalsy()
  })

  it('should validate as false if person id is not enough numbers', () => {
    expect(isPersonIdValid('19121212121')).toBeFalsy()
  })

  it('should validate as false if person id is numbers mixed with letters', () => {
    expect(isPersonIdValid('19121212121n')).toBeFalsy()
  })

  describe('Personnummer', () => {
    it('should validate as true if person id is correct', () => {
      expect(isPersonIdValid('191212121212')).toBeTruthy()
    })

    it('should validate as true if person id is correct and includes dash', () => {
      expect(isPersonIdValid('19121212-1212')).toBeTruthy()
    })

    it('should validate as false if person id is not correct ', () => {
      expect(isPersonIdValid('191212121213')).toBeFalsy()
    })

    it('should validate as false if person id is not correct and includes dash', () => {
      expect(isPersonIdValid('19121212-1213')).toBeFalsy()
    })
  })

  describe('Samordningsnummer', () => {
    it('should validate as true if person id is correct', () => {
      expect(isPersonIdValid('195401875769')).toBeTruthy()
    })

    it('should validate as true if person id is correct and includes dash', () => {
      expect(isPersonIdValid('19540187-5769')).toBeTruthy()
    })

    it('should validate as false if person id is not correct', () => {
      expect(isPersonIdValid('195401875761')).toBeFalsy()
    })

    it('should validate as false if person id is not correct and includes dash', () => {
      expect(isPersonIdValid('19540187-5761')).toBeFalsy()
    })
  })
})
