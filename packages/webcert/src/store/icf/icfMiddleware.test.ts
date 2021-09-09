import MockAdapter from 'axios-mock-adapter'
import { getIcfCodes, IcfRequest, updateIcfCodes } from './icfActions'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { icfMiddleware } from './icfMiddleware'
import { IcdCode, IcfCode, IcfState } from './icfReducer'
import { Certificate, CertificateStatus, IcfTitles } from '@frontend/common'
import { updateCertificate } from '../certificate/certificateActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test ICF middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, ...icfMiddleware),
    })
  })

  describe('Handle getIcfCodes', () => {
    it('shall update ICF state', async () => {
      const icdCodes: IcfRequest[] = [
        { icd10Code: 'A02' },
        {
          icd10Code: 'U071',
        },
      ]
      const expectedIcfInfo = getIcfData()
      fakeAxios.onGet('/api/icf/facade').reply(200, expectedIcfInfo)

      testStore.dispatch(getIcfCodes(icdCodes))

      await flushPromises()
      expect(testStore.getState().ui.uiIcf.disability).toEqual(expectedIcfInfo.disability)
      expect(testStore.getState().ui.uiIcf.activityLimitation).toEqual(expectedIcfInfo.activityLimitation)
    })
  })

  describe('Handle updateIcfCodes', () => {
    it('shall update ICF state', async () => {
      const expectedIcfInfo = getIcfData()

      testStore.dispatch(updateIcfCodes(expectedIcfInfo))

      await flushPromises()
      expect(testStore.getState().ui.uiIcf.disability).toEqual(expectedIcfInfo.disability)
      expect(testStore.getState().ui.uiIcf.activityLimitation).toEqual(expectedIcfInfo.activityLimitation)
    })
  })

  describe('Handle updateCertificate', () => {
    it('shall update icf codes', async () => {
      const expectedIcfTitles = getIcfTitles()
      const certificate = getCertificate(expectedIcfTitles)

      testStore.dispatch(updateCertificate(certificate))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.icfTitles).toEqual(expectedIcfTitles)
    })

    it('shall fetch icf codes when ', async () => {
      const expectedIcfTitles = getIcfTitles()
      const certificate = getCertificate(expectedIcfTitles)

      testStore.dispatch(updateCertificate(certificate))

      await flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.icfTitles).toEqual(expectedIcfTitles)
    })
  })
})

const getIcfData = (): IcfState => {
  const icfCodes: IcfCode[] = [
    {
      code: '1',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '2',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '3',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: IcdCode[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes: icfCodes, icdCodes: icdCodes },
      uniqueCodes: [
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_1] },
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_2] },
      ],
    },
    disability: {
      commonCodes: { icfCodes: icfCodes, icdCodes: icdCodes },
      uniqueCodes: [
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_1] },
        { icfCodes: icfCodes, icdCodes: [ICD_CODE_2] },
      ],
    },
  }
}

const getCertificate = (icfTitles: IcfTitles): Certificate => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    metadata: { id: 'certificateId' },
    status: CertificateStatus.SIGNED,
    icfTitles: icfTitles,
  }
}

const getIcfTitles = (): IcfTitles => {
  return {
    disability: { unique: ['Test 2', 'Test 3'], common: ['Test 0', 'Test 1', 'Test 2', 'Test 3'] },
    activityLimitation: { unique: ['Test 0', 'Test 1'], common: ['Test 0', 'Test 1', 'Test 2', 'Test 3'] },
  }
}
