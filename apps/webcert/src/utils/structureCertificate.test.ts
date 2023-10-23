import { CertificateDataElementStyleEnum, fakeCategoryElement, fakeCheckboxBooleanElement } from '@frontend/common'
import { structureCertificate } from './structureCertificate'

describe('structureCertificate', () => {
  it('Should return list of elements', () => {
    const input = {
      ...fakeCategoryElement({ id: '1', index: 1 }),
      ...fakeCategoryElement({ id: '2', index: 2 }),
    }
    expect(structureCertificate(input)).toMatchObject([{ id: '1' }, { id: '2' }])
  })

  it('Should sort elements by index', () => {
    const input = {
      ...fakeCategoryElement({ id: '2', index: 2 }),
      ...fakeCategoryElement({ id: '4', index: 4 }),
      ...fakeCategoryElement({ id: '1', index: 1 }),
    }
    expect(structureCertificate(input)).toMatchObject([
      { id: '1', index: 1 },
      { id: '2', index: 2 },
      { id: '4', index: 4 },
    ])
  })

  it("Should have a sorted list of subQuestionId's by index", () => {
    const input = {
      ...fakeCheckboxBooleanElement({ id: '1', index: 1 }),
      ...fakeCheckboxBooleanElement({ id: '8', index: 8, parent: '1' }),
      ...fakeCheckboxBooleanElement({ id: '4', index: 4, parent: '1' }),
      ...fakeCheckboxBooleanElement({ id: '3', index: 3, parent: '1' }),
      ...fakeCheckboxBooleanElement({ id: '7', index: 7, parent: '1' }),
    }
    expect(structureCertificate(input)).toMatchObject([{ id: '1', index: 1, subQuestionIds: ['3', '4', '7', '8'] }])
  })

  it('Should not include subQuestion elements in returned list', () => {
    const input = {
      ...fakeCheckboxBooleanElement({ id: '1', index: 1 }),
      ...fakeCheckboxBooleanElement({ id: '3', index: 3, parent: '1' }),
      ...fakeCheckboxBooleanElement({ id: '2', index: 2 }),
      ...fakeCheckboxBooleanElement({ id: '4', index: 4, parent: '2' }),
    }

    const result = structureCertificate(input)

    expect(result.length).toBe(2)
    expect(result).toMatchObject([
      { id: '1', index: 1, subQuestionIds: ['3'] },
      { id: '2', index: 2, subQuestionIds: ['4'] },
    ])
  })

  it('Should not include subQuestionId when parent is a category', () => {
    const input = {
      ...fakeCategoryElement({ id: '1', index: 1 }),
      ...fakeCheckboxBooleanElement({ id: '2', index: 2, parent: '1' }),
    }
    expect(structureCertificate(input)).toMatchObject([
      { id: '1', index: 1, subQuestionIds: [] },
      { id: '2', index: 2 },
    ])
  })

  it('Should not include subQuestionId when child is a category', () => {
    const input = {
      ...fakeCategoryElement({ id: '1', index: 1 }),
      ...fakeCategoryElement({ id: '2', index: 2, parent: '1' }),
    }
    expect(structureCertificate(input)).toMatchObject([
      { id: '1', index: 1, subQuestionIds: [] },
      { id: '2', index: 2 },
    ])
  })

  it('Should not include hidden subQuestionIds', () => {
    const input = {
      ...fakeCategoryElement({ id: '1', index: 1 }),
      ...fakeCheckboxBooleanElement({ id: '2', index: 2, parent: '1', style: CertificateDataElementStyleEnum.HIDDEN }),
    }
    expect(structureCertificate(input)).toMatchObject([{ id: '1', index: 1, subQuestionIds: [] }])
  })
})
