import { fakeCheckboxDateRangeList, fakeDateElement, fakeYearElement } from '../../faker'
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
          text: 'Ange giltigt datum i formatet åååå-mm-dd.',
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
      const dataElement = fakeCheckboxDateRangeList({ id: 'question', value: { list: [{ id: 'foo', from: 'abc', to: 'abc' }] } }).question
      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'from.foo',
          type: 'INVALID_DATE_FORMAT',
          text: 'Ange giltigt datum i formatet åååå-mm-dd.',
          showAlways: true,
        },
        {
          id: 'question',
          field: 'tom.foo',
          type: 'INVALID_DATE_FORMAT',
          text: 'Ange giltigt datum i formatet åååå-mm-dd.',
          showAlways: true,
        },
      ])
    })

    it('Should return UNREASONABLE_DATE for dates too far in the future', () => {
      const dataElement = fakeCheckboxDateRangeList({
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
      const dataElement = fakeCheckboxDateRangeList({
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
      const dataElement = fakeCheckboxDateRangeList({ id: 'question', value: { list: [{ id: 'foo', from: undefined, to: '' }] } }).question

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
      const dataElement = fakeCheckboxDateRangeList({
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
  describe(`${ConfigTypes.UE_DATE}`, () => {
    it('Should return before min error if date is before min', () => {
      const dataElement = fakeDateElement({
        id: 'question',
        config: {
          minDate: '2024-01-01',
        },
        value: {
          date: '2023-12-31',
        },
      }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'question',
          type: 'DATE_VIOLATES_LIMIT',
          text: 'Ange ett datum som är tidigast 2024-01-01.',
          showAlways: true,
        },
      ])
    })

    it('Should return before max error if date is after max', () => {
      const dataElement = fakeDateElement({
        id: 'question',
        config: {
          minDate: '2023-12-31',
          maxDate: '2024-01-01',
        },
        value: {
          date: '2024-01-02',
        },
      }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'question',
          type: 'DATE_VIOLATES_LIMIT',
          text: 'Ange ett datum som är senast 2024-01-01.',
          showAlways: true,
        },
      ])
    })
  })

  describe(`${ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST}`, () => {
    it('Should return OVERLAP_ERROR for overlapping dates', () => {
      const dataElement = fakeCheckboxDateRangeList({
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

    it('Should return before min error if date is before min', () => {
      const dataElement = fakeCheckboxDateRangeList({
        id: 'question',
        config: {
          min: '2024-01-01',
        },
        value: {
          list: [{ id: 'first', from: '2023-12-30', to: '2023-12-31' }],
        },
      }).question

      expect(getClientValidationErrors(dataElement)).toMatchObject([
        {
          id: 'question',
          field: 'first.from',
          type: 'DATE_VIOLATES_LIMIT',
          text: 'Ange ett datum som är tidigast 2024-01-01.',
          showAlways: true,
        },
        {
          id: 'question',
          field: 'first.to',
          type: 'DATE_VIOLATES_LIMIT',
          text: 'Ange ett datum som är tidigast 2024-01-01.',
          showAlways: true,
        },
      ])
    })
  })

  it('Should return limit violation error if date is after max limit', () => {
    const dataElement = fakeCheckboxDateRangeList({
      id: 'question',
      config: {
        max: '2020-01-01',
      },
      value: {
        list: [{ id: 'first', from: '2023-12-30', to: '2023-12-31' }],
      },
    }).question

    expect(getClientValidationErrors(dataElement)).toMatchObject([
      {
        id: 'question',
        field: 'first.from',
        type: 'DATE_VIOLATES_LIMIT',
        text: 'Ange ett datum som är senast 2020-01-01.',
        showAlways: true,
      },
      {
        id: 'question',
        field: 'first.to',
        type: 'DATE_VIOLATES_LIMIT',
        text: 'Ange ett datum som är senast 2020-01-01.',
        showAlways: true,
      },
    ])
  })
})
