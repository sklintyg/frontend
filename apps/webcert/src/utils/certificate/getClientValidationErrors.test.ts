import { fakeDateElement, fakeSickLeavePeriod, fakeYearElement } from '../../faker'
import { CertificateDataValueType, ConfigTypes } from '../../types/certificate'
import { getClientValidationErrors } from './getClientValidationErrors'

describe('Validation based on value', () => {
  describe(`${CertificateDataValueType.DATE}`, () => {
    it('Should return INVALID_DATE_FORMAT for invalid date', () => {
      const dataElement = fakeDateElement({ id: 'question', value: { id: 'field', date: 'abc' } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'INVALID_DATE_FORMAT',
          text: 'Ange datum i formatet åååå-mm-dd.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_DATE for dates too far in the future', () => {
      const dataElement = fakeDateElement({ id: 'question', value: { id: 'field', date: '2099-12-13' } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_DATE for dates too far in the past', () => {
      const dataElement = fakeDateElement({ id: 'question', value: { id: 'field', date: '1212-12-12' } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })
  })

  describe(`${CertificateDataValueType.DATE_RANGE}`, () => {
    it('Should return INVALID_DATE_FORMAT for invalid date', () => {
      const dataElement = fakeSickLeavePeriod({ id: 'question', value: { list: [{ id: 'foo', from: 'abc', to: 'abc' }] } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'from.foo',
          type: 'INVALID_DATE_FORMAT',
          text: 'Ange datum i formatet åååå-mm-dd.',
          showAlways: true,
        },
        {
          id: 'question',
          field: 'tom.foo',
          type: 'INVALID_DATE_FORMAT',
          text: 'Ange datum i formatet åååå-mm-dd.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_DATE for dates too far in the future', () => {
      const dataElement = fakeSickLeavePeriod({
        id: 'question',
        value: { list: [{ id: 'foo', from: '2099-12-13', to: '2099-12-13' }] },
      }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'from.foo',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
        {
          id: 'question',
          field: 'tom.foo',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_DATE for dates too far in the past', () => {
      const dataElement = fakeSickLeavePeriod({
        id: 'question',
        value: { list: [{ id: 'foo', from: '1212-12-12', to: '1212-12-12' }] },
      }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'from.foo',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
        {
          id: 'question',
          field: 'tom.foo',
          type: 'UNREASONABLE_DATE',
          text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })

    it('Should return EMPTY_PERIOD for row if both dates are empty', () => {
      const dataElement = fakeSickLeavePeriod({ id: 'question', value: { list: [{ id: 'foo', from: undefined, to: '' }] } }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'row.foo',
          type: 'EMPTY_PERIOD',
          text: 'Ange period.',
          showAlways: false,
        },
      ])
    })

    it('Should return INVALID_DATE_PERIOD_ERROR for invalid periods', () => {
      const dataElement = fakeSickLeavePeriod({
        id: 'question',
        value: { list: [{ id: 'foo', from: '2022-01-12', to: '2022-01-11' }] },
      }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'row.foo',
          type: 'INVALID_DATE_PERIOD',
          text: 'Ange ett slutdatum som infaller efter startdatumet.',
          showAlways: true,
        },
      ])
    })
  })

  describe(`${CertificateDataValueType.YEAR}`, () => {
    it('Should return INVALID_YEAR_FORMAT for invalid date', () => {
      const dataElement = fakeYearElement({ id: 'question', value: { id: 'field', year: 'abc' } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'INVALID_YEAR_FORMAT',
          text: 'Ange år i formatet åååå.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_YEAR for dates too far in the future', () => {
      const dataElement = fakeYearElement({ id: 'question', value: { id: 'field', year: 3000 } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'UNREASONABLE_YEAR',
          text: 'Ange ett år som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_YEAR for dates too far in the past', () => {
      const dataElement = fakeYearElement({ id: 'question', value: { id: 'field', year: 1200 } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'field',
          type: 'UNREASONABLE_YEAR',
          text: 'Ange ett år som inte ligger för långt fram eller tillbaka i tiden.',
          showAlways: true,
        },
      ])
    })
  })
})

describe('Validation based on config', () => {
  describe(`${ConfigTypes.UE_SICK_LEAVE_PERIOD}`, () => {
    it('Should return OVERLAP_ERROR for overlapping dates', () => {
      const dataElement = fakeSickLeavePeriod({
        id: 'question',
        value: {
          list: [
            { id: 'first', from: '2022-01-12', to: '2022-02-12' },
            { id: 'second', from: '2022-01-06', to: '2022-03-12' },
          ],
        },
      }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'question',
          type: 'OVERLAP_ERROR',
          text: 'Ange sjukskrivningsperioder som inte överlappar varandra.',
          showAlways: true,
        },
      ])
    })
  })
})
