import { expect, it, describe } from 'vitest'
import { getEmptyFiltrationText, getEmptyTableText, getSearchText } from './tableTextGeneratorUtils'
import { UserUrval } from '../../../schemas'
import { fakeUser } from '../../../utils/fake/fakeUser'

describe('Table text generator utils', () => {
  describe('getEmptyFiltrationText', () => {
    it('should return text with table name', () => {
      expect(getEmptyFiltrationText('sjukfall')).toEqual('Inga sjukfall matchade filtreringen.')
    })

    it('should return text with table name inclduing swedish chars', () => {
      expect(getEmptyFiltrationText('läkarutlåtanden')).toEqual('Inga läkarutlåtanden matchade filtreringen.')
    })
  })

  describe('getEmptyTableText', () => {
    it('should return text for doctor', () => {
      const user = fakeUser({ urval: UserUrval.ISSUED_BY_ME, valdVardenhet: { namn: 'enhetsNamn' } })
      expect(getEmptyTableText(user, 'sjukfall')).toEqual('Du har inga sjukfall på enhetsNamn.')
    })

    it('should return text for reko', () => {
      const user = fakeUser({ urval: '', valdVardenhet: { namn: 'enhetsNamn' } })
      expect(getEmptyTableText(user, 'läkarutlåtanden')).toEqual('Det finns inga läkarutlåtanden på enhetsNamn.')
    })
  })

  describe('getSearchText', () => {
    it('should return text for doctor', () => {
      expect(getSearchText(true, 'sjukfall')).toEqual(
        'Tryck på Sök för att visa alla dina sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av sjukfall.'
      )
    })

    it('should return text for reko', () => {
      expect(getSearchText(false, 'sjukfall')).toEqual(
        'Tryck på Sök för att visa alla sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av sjukfall.'
      )
    })

    it('should return text with suffix', () => {
      expect(getSearchText(false, 'sjukfall', 'with suffix')).toEqual(
        'Tryck på Sök för att visa alla sjukfall för enheten, eller ange filterval och tryck på Sök för att visa urval av sjukfall.\nwith suffix'
      )
    })
  })
})
