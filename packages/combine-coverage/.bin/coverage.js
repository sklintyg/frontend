#!/usr/bin/env node

const glob = require('glob')
const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')

const REPORTS_FOLDER = 'coverage'

const run = async () => {
  const files = await glob('**/*/coverage/coverage-final.json', { ignore: 'node_modules/**' })

  if (files.length === 0) {
    console.log('No coverage files found')
    return
  }

  fs.emptyDirSync(REPORTS_FOLDER)

  files.forEach((filename) => {
    const package = path
      .dirname(filename)
      .split(path.sep)
      .slice(0, -1)
      .pop()

    fs.copyFileSync(filename, `${REPORTS_FOLDER}/from-${package}.json`)
  })

  fs.emptyDirSync('.nyc_output')

  execSync(`nyc merge ${REPORTS_FOLDER}`, { stdio: 'inherit' })

  fs.renameSync(path.resolve(`./coverage.json`), path.resolve('.nyc_output/out.json'))

  execSync(`nyc report --reporter cobertura --report-dir .`, { stdio: 'inherit' })
}

run()
