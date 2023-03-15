/* eslint-disable no-console */
/* eslint-disable import/no-default-export */
import axios from 'axios'
import { defineConfig } from 'cypress'
import { CertificateType } from '../types/CertificateType'

const baseUrl = 'https://wc2.webcert-devtest.intyg.nordicmedtest.se'

async function fetchCertificateTypes() {
  return (await axios.get<{ certificateTypes: CertificateType[] }>(`${baseUrl}/testability/certificate/types`)).data
}

async function fetchPatients() {
  return (await axios.get(`${baseUrl}/testability/certificate/patients`)).data
}

export default defineConfig({
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    async setupNodeEvents(on, config) {
      const { certificateTypes } = await fetchCertificateTypes()

      // eslint-disable-next-line no-param-reassign
      config.env.certificateTypes = certificateTypes
      console.log(config.env.certificateTypes)

      return config
    },
    baseUrl,
    specPattern: 'specs/webcert/**/*.{js,jsx,ts,tsx}',
  },
})
