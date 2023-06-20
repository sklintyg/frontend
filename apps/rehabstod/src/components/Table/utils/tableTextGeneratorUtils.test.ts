import {
  getEmptyFiltrationText,
  getEmptyTableText,
  getSearchText,
  getTableErrorDescription,
  getTableErrorTitle,
} from './tableTextGeneratorUtils'
import { fakeUser } from '../../../utils/fake/fakeUser'
import { UserUrval } from '../../../schemas'

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

  describe('getErrorTableTitle', () => {
    it('should return title with table name', () => {
      expect(getTableErrorTitle('sjukfall')).toEqual('Sjukfall för enheten kunde inte hämtas.')
    })

    it('should return title with table name including Swedish chars', () => {
      expect(getTableErrorTitle('läkarutlåtanden')).toEqual('Läkarutlåtanden för enheten kunde inte hämtas.')
    })
  })

  describe('getErrorTableDescription', () => {
    it('should return text with table name', () => {
      expect(getTableErrorDescription('sjukfall')).toEqual(
        'Enhetens sjukfall kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand '
      )
    })

    it('should return text with table name including Swedish chars', () => {
      expect(getTableErrorDescription('läkarutlåtanden')).toEqual(
        'Enhetens läkarutlåtanden kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand '
      )
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
