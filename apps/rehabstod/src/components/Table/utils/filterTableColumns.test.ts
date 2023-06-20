import { filterTableColumns } from './filterTableColumns'

const columns = [
  { name: 'Personnummer', visible: true },
  { name: 'Namn', visible: true },
  { name: 'Diagnos', visible: true },
  { name: 'Risk', visible: true },
  { name: 'Läkare', visible: true },
  { name: 'NotVisible', visible: false },
]

describe('filterTableColumns', () => {
  describe('personal information', () => {
    it('should filter personnummer if showPersonalInformation is false', () => {
      const response = filterTableColumns(columns, false, false, false, true)
      expect(response.some((column) => column.name === 'Personnummer')).toBeFalsy()
      expect(response).toHaveLength(columns.length - 2)
    })

    it('should filter name if showPersonalInformation is false', () => {
      const response = filterTableColumns(columns, false, false, false, true)
      expect(response.some((column) => column.name === 'Namn')).toBeFalsy()
      expect(response).toHaveLength(columns.length - 2)
    })

    it('should not filter personnummer if showPersonalInformation is true', () => {
      const response = filterTableColumns(columns, false, true, false, true)
      expect(response.some((column) => column.name === 'Personnummer')).toBeTruthy()
      expect(response).toEqual(columns)
    })

    it('should not filter name if showPersonalInformation is true', () => {
      const response = filterTableColumns(columns, false, true, false, true)
      expect(response.some((column) => column.name === 'Namn')).toBeTruthy()
      expect(response).toEqual(columns)
    })
  })

  describe('visible', () => {
    it('should not filter not visible columns if only visible is false', () => {
      const response = filterTableColumns(columns, false, true, false, true)
      expect(response.some((column) => column.name === 'NotVisible')).toBeTruthy()
      expect(response).toEqual(columns)
    })

    it('should filter not visible columns if only visible is true', () => {
      const response = filterTableColumns(columns, false, true, true, true)
      expect(response.some((column) => column.name === 'NotVisible')).toBeFalsy()
      expect(response).toHaveLength(columns.length - 1)
    })
  })

  describe('srs', () => {
    it('should not filter risk column if srsActivated is true', () => {
      const response = filterTableColumns(columns, false, true, false, true)
      expect(response.some((column) => column.name === 'Risk')).toBeTruthy()
      expect(response).toEqual(columns)
    })

    it('should filter risk column if srsActivated is false', () => {
      const response = filterTableColumns(columns, false, true, false, false)
      expect(response.some((column) => column.name === 'Risk')).toBeFalsy()
      expect(response).toHaveLength(columns.length - 1)
    })
  })

  describe('filter specific columns', () => {
    it('should filter specific columns if sent as parameter', () => {
      const response = filterTableColumns(columns, false, true, false, true, ['Diagnos'])
      expect(response.some((column) => column.name === 'Diagnos')).toBeFalsy()
      expect(response).toHaveLength(columns.length - 1)
    })
  })
})
