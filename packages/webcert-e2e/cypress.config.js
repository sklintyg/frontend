const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  env: {
    webcertUrl: 'https://webcert-devtest.intyg.nordicmedtest.se',
    intygMockBaseUrl: 'http://nmt-vs-tintyg.intyg.nordicmedtest.se',
    intygTjanstUrl: 'https://intygstjanst-devtest.intyg.nordicmedtest.se',
    logSenderTimeout: 45000,
    RETRIES: 2,
    'cypress-react-selector': {
      root: '#root',
    },
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  reporterOptions: {
    mochaFile: 'results/test-results.[hash].xml',
    toConsole: true,
  },
  viewportHeight: 900,
  viewportWidth: 1440,
  projectId: '1diiry',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('after:screenshot', (details) => {
        // console.log(details.specName) // print all details to terminal
  
        const fileName = details.takenAt.replace(/:/g,".") +".png"
        // console.log(fileName);
        const newPath = "screenshots/" + details.specName + "/" + fileName;
        // console.log(newPath);

        return new Promise((resolve, reject) => {
            // fs.rename uses the same path as the existing screenshot
            // and renames the image based on date and time taken.
            fs.rename(details.path, newPath, (err) => {
                if (err) return reject(err)
  
                // because we renamed and moved the image, resolve with the new path
                // so it is accurate in the test results
                resolve({ path: newPath })
            })
        })
    })
      return require('./plugins/index.js')(on, config)
    },
    baseUrl: 'https://wc2.webcert-devtest.intyg.nordicmedtest.se',
    specPattern: 'integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'support/index.js',
  },
})