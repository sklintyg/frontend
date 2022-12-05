import { getKeyValuePair, validateExpression, maxDateToExpression } from './validateExpression'
import { CertificateDataValueType, CertificateDataValidationType } from '../types/certificate'
import { getUnixTime, addDays, subDays, format } from 'date-fns'

jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'))

describe('getKeyValuePair', () => {
  it('Should convert BOOLEAN to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.BOOLEAN,
        id: 'IDENTIFIER',
        selected: true,
      })
    ).toEqual({ IDENTIFIER: true })
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.BOOLEAN,
        id: 'IDENTIFIER',
        selected: false,
      })
    ).toEqual({ IDENTIFIER: false })
  })

  it('Should convert CODE to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.CODE,
        id: 'IDENTIFIER',
        code: 'VALUE',
      })
    ).toEqual({ IDENTIFIER: 'VALUE' })

    expect(
      getKeyValuePair({
        type: CertificateDataValueType.CODE,
        id: 'IDENTIFIER',
        code: 'OTHER',
      })
    ).toEqual({ IDENTIFIER: 'OTHER' })
  })

  it('Should convert TEXT to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.TEXT,
        id: 'IDENTIFIER',
        text: 'VALUE',
      })
    ).toEqual({ IDENTIFIER: 'VALUE' })
  })

  it('Should convert ICF to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.ICF,
        id: 'IDENTIFIER',
        text: 'VALUE',
      })
    ).toEqual({ IDENTIFIER: 'VALUE' })
  })

  it('Should convert CODE_LIST to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.CODE_LIST,
        id: 'LIST',
        list: Array.from({ length: 3 }, (_, index) => ({
          type: CertificateDataValueType.CODE,
          id: `LIST.${index + 1}`,
          code: 'VALUE',
        })),
      })
    ).toEqual({ 'LIST.1': 'VALUE', 'LIST.2': 'VALUE', 'LIST.3': 'VALUE' })
  })

  it('Should convert CAUSE_OF_DEATH to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.CAUSE_OF_DEATH,
        id: 'cause',
        debut: {
          type: CertificateDataValueType.DATE,
          id: 'debut',
          date: '2019-01-04',
        },
        description: {
          type: CertificateDataValueType.TEXT,
          id: 'description',
          text: 'Hello',
        },
        specification: {
          type: CertificateDataValueType.CODE,
          id: 'specification',
          code: 'specification',
        },
      })
    ).toEqual({ debut: 1546556400, description: 'Hello', specification: 'specification' })
  })

  it('Should convert list of CAUSE_OF_DEATH to key-value pair', () => {
    expect(
      getKeyValuePair({
        type: CertificateDataValueType.CAUSE_OF_DEATH_LIST,
        list: Array.from({ length: 3 }, (_, index) => ({
          type: CertificateDataValueType.CAUSE_OF_DEATH,
          id: 'cause',
          debut: {
            type: CertificateDataValueType.DATE,
            id: `cause[${index + 1}].debut`,
            date: '2019-01-04',
          },
          description: {
            type: CertificateDataValueType.TEXT,
            id: `cause[${index + 1}].description`,
            text: 'Hello',
          },
          specification: {
            type: CertificateDataValueType.CODE,
            id: `cause[${index + 1}].specification`,
            code: 'specification',
          },
        })),
      })
    ).toEqual({
      'cause[1].debut': 1546556400,
      'cause[1].description': 'Hello',
      'cause[1].specification': 'specification',
      'cause[2].debut': 1546556400,
      'cause[2].description': 'Hello',
      'cause[2].specification': 'specification',
      'cause[3].debut': 1546556400,
      'cause[3].description': 'Hello',
      'cause[3].specification': 'specification',
    })
  })
})

describe('maxDateToExpression', () => {
  it('Should convert validation to expression', () => {
    const expected = getUnixTime(addDays(new Date('2020-01-01'), 2))
    expect(
      maxDateToExpression({
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        numberOfDays: 2,
        id: 'ID',
        questionId: '',
      })
    ).toEqual(`ID <= ${expected}`)
  })

  it('Should convert validation to expression for negative value', () => {
    const expected = getUnixTime(subDays(new Date('2020-01-01'), 2))
    expect(
      maxDateToExpression({
        type: CertificateDataValidationType.MAX_DATE_VALIDATION,
        numberOfDays: -2,
        id: 'ID',
        questionId: '',
      })
    ).toEqual(`ID <= ${expected}`)
  })

  it('Should return true for date below max date', () => {
    expect(
      validateExpression(
        maxDateToExpression({
          type: CertificateDataValidationType.MAX_DATE_VALIDATION,
          numberOfDays: 2,
          id: 'ID',
          questionId: '',
        }),
        {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2020-01-03',
        }
      )
    ).toBe(true)
  })

  it('Should return false for date over max date', () => {
    expect(
      validateExpression(
        maxDateToExpression({
          type: CertificateDataValidationType.MAX_DATE_VALIDATION,
          numberOfDays: 2,
          id: 'ID',
          questionId: '',
        }),
        {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2020-01-04',
        }
      )
    ).toBe(false)
  })
})

describe('validateExpression', () => {
  describe('BOOLEAN', () => {
    it('Should return true when selected is true', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: true })).toBe(true)
    })

    it('Should return false when selected is false', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: false })).toBe(false)
    })

    it('Should return false when selected is null', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: null })).toBe(false)
    })

    it('Should return false when selected is undefined', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: undefined })).toBe(false)
    })

    it('Should return false when selected is true for negative expression', () => {
      expect(validateExpression('!ID', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: true })).toBe(false)
    })
  })

  // Skip until code is refactored to work as every other value
  describe.skip('CODE', () => {
    it('Should return true when code is not empty', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.CODE, id: 'ID', code: 'ID' })).toBe(true)
    })

    it('Should return false when code is empty', () => {
      expect(validateExpression('ID', { type: CertificateDataValueType.CODE, id: 'ID', code: '' })).toBe(false)
    })
  })

  describe('CODE_LIST', () => {
    it('Should return true when every code item is available', () => {
      expect(
        validateExpression('ITEM_1 and ITEM_2 ', {
          type: CertificateDataValueType.CODE_LIST,
          id: 'ITEM',
          list: Array.from({ length: 3 }, (_, index) => ({
            type: CertificateDataValueType.CODE,
            id: `ITEM_${index + 1}`,
            code: `ITEM_${index + 1}`,
          })),
        })
      ).toBe(true)
    })

    it('Should return true when any code item is available', () => {
      expect(
        validateExpression('ITEM_1 or ITEM_2', {
          type: CertificateDataValueType.CODE_LIST,
          id: 'ITEM',
          list: [
            {
              type: CertificateDataValueType.CODE,
              id: `ITEM_1`,
              code: `ITEM_1`,
            },
            {
              type: CertificateDataValueType.CODE,
              id: `ITEM_2`,
              code: '',
            },
          ],
        })
      ).toBe(true)
    })
  })

  it('Should validate DATE value correctly', () => {
    expect(
      validateExpression('ID', {
        type: CertificateDataValueType.DATE,
        id: 'ID',
        date: '2019-01-04',
      })
    ).toBe(true)

    expect(
      validateExpression('ID', {
        type: CertificateDataValueType.DATE,
        id: 'ID',
        date: undefined,
      })
    ).toBe(false)

    expect(
      validateExpression('ID', {
        type: CertificateDataValueType.DATE,
        id: 'ID',
        date: 'invalid date',
      })
    ).toBe(false)
  })

  describe('comparison', () => {
    it('Should return true for equal match', () => {
      expect(
        validateExpression('ID == 1546556400', {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2019-01-04',
        })
      ).toBe(true)
    })

    it('Should return false for non-equal match', () => {
      expect(
        validateExpression('ID != 1546556400', {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2019-01-04',
        })
      ).toBe(false)
    })

    it('Should return true for above match', () => {
      expect(
        validateExpression('ID >= 1546556300', {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2019-01-04',
        })
      ).toBe(true)
    })

    it('Should return true for below match', () => {
      expect(
        validateExpression('ID <= 1546556500', {
          type: CertificateDataValueType.DATE,
          id: 'ID',
          date: '2019-01-04',
        })
      ).toBe(true)
    })
  })

  describe('extra functions', () => {
    describe('epochDay', () => {
      it('Should return true if epochDay has expected value', () => {
        expect(
          validateExpression('epochDay(ID) == 18993', {
            type: CertificateDataValueType.DATE,
            id: 'ID',
            date: '2022-01-01',
          })
        ).toBe(true)
      })

      it('Should return false if epochDay is used on string', () => {
        expect(
          validateExpression('epochDay(ID) == 18993', {
            type: CertificateDataValueType.TEXT,
            id: 'ID',
            text: '2022-01-01',
          })
        ).toBe(false)
      })
    })

    describe('days', () => {
      it('Should convert unix timestampt to days from current date', () => {
        expect(
          validateExpression(`days(ID) == 8`, {
            type: CertificateDataValueType.DATE,
            id: 'ID',
            date: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
          })
        ).toBe(true)
      })

      it('Should return negative number if date is in the past', () => {
        expect(
          validateExpression(`days(ID) == -8`, {
            type: CertificateDataValueType.DATE,
            id: 'ID',
            date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
          })
        ).toBe(true)
      })
    })

    describe('uncertainDate', () => {
      it('Should return true if date is valid', () => {
        expect(
          validateExpression('uncertainDate(ID)', {
            type: CertificateDataValueType.TEXT,
            id: 'ID',
            text: '0000-00-00',
          })
        ).toBe(true)
      })

      it('Should return false if date is invalid', () => {
        expect(
          validateExpression('uncertainDate(ID)', {
            type: CertificateDataValueType.TEXT,
            id: 'ID',
            text: '123456789',
          })
        ).toBe(false)
      })
    })

    describe('exists', () => {
      it('Should return false when value is undefined', () => {
        expect(validateExpression('exists(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: undefined })).toBe(false)
      })

      it('Should return false when value is null', () => {
        expect(validateExpression('exists(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: null })).toBe(false)
      })

      it('Should return true when value is true', () => {
        expect(validateExpression('exists(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: true })).toBe(true)
      })

      it('Should return true when value is false', () => {
        expect(validateExpression('exists(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: false })).toBe(true)
      })
    })

    describe('empty', () => {
      it('Should return true when value is null', () => {
        expect(validateExpression('empty(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: undefined })).toBe(true)
      })

      it('Should return false when value is true', () => {
        expect(validateExpression('empty(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: true })).toBe(false)
      })

      it('Should return false when value is false', () => {
        expect(validateExpression('empty(ID)', { type: CertificateDataValueType.BOOLEAN, id: 'ID', selected: false })).toBe(false)
      })

      it('Should return true when value is empty string', () => {
        expect(validateExpression('empty(ID)', { type: CertificateDataValueType.TEXT, id: 'ID', text: '' })).toBe(true)
      })

      it('Should return false when value is populated string', () => {
        expect(validateExpression('empty(ID)', { type: CertificateDataValueType.TEXT, id: 'ID', text: 'lorem' })).toBe(false)
      })
    })
  })
})
