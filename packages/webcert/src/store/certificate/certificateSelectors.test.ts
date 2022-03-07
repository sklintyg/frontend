import { CertificateDataElement, ConfigTypes } from '@frontend/common'
import { RootState } from '../store'
import { getCertificateDataElements } from './certificateSelectors'

const createDataElement = ({ id = '', parent = '', type = ConfigTypes.UE_ICF, index = 0 }): CertificateDataElement => ({
  id,
  config: { type, text: '', description: '' },
  parent,
  index,
  visible: true,
  readOnly: false,
  mandatory: false,
  value: null,
  validation: [],
  validationErrors: [],
})

const getState = (): RootState =>
  (({
    ui: {
      uiCertificate: {
        certificate: {
          data: {
            '1': createDataElement({ id: '1', parent: 'funktionsnedsattning', index: 3 }),
            '1.2': createDataElement({ id: '1.2', parent: '1', index: 5 }),
            '1.1': createDataElement({ id: '1.1', parent: '1', index: 4 }),
            '1.3': createDataElement({ id: '1.3', parent: '1', index: 6 }),
            '28': createDataElement({ id: '28', parent: 'sysselsattning', index: 1 }),
            funktionsnedsattning: createDataElement({ id: 'funktionsnedsattning', type: ConfigTypes.CATEGORY, index: 2 }),
            sysselsattning: createDataElement({ id: 'sysselsattning', type: ConfigTypes.CATEGORY, index: 0 }),
          },
        },
      },
    },
  } as unknown) as RootState)

describe('certificateSelectors', () => {
  describe('getCertificateDataElements', () => {
    it('should group sub questions with parent question', () => {
      const elements = getCertificateDataElements(getState())

      expect(elements.length).toBe(4)
    })

    it('should not group categories with sub questions', () => {
      const elements = getCertificateDataElements(getState())

      expect(elements[0].subQuestionIds).toEqual([])
    })

    it('should sort categories, questions and sub questions by index', () => {
      const elements = getCertificateDataElements(getState())
      const ids = elements.map((el) => [el.id, ...el.subQuestionIds]).reduce((acc, curr) => acc.concat(curr), [])

      expect(ids).toEqual(['sysselsattning', '28', 'funktionsnedsattning', '1', '1.1', '1.2', '1.3'])
    })
  })
})
