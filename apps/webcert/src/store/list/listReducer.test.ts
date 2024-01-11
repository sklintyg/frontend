import { EnhancedStore } from '@reduxjs/toolkit'
import { expect, it, describe, beforeEach } from 'vitest'
import { updateActiveList, updateListItemAsForwarded } from './listActions'
import { configureApplicationStore } from '../configureApplicationStore'
import dispatchHelperMiddleware from '../test/dispatchHelperMiddleware'

const getList = () => [
  { values: { CERTIFICATE_ID: 'id1', FORWARDED: false } },
  { values: { CERTIFICATE_ID: 'id1', FORWARDED: false } },
  { values: { CERTIFICATE_ID: 'id2', FORWARDED: false } },
  { values: { CERTIFICATE_ID: 'id3', FORWARDED: false } },
]
describe('List reducer test', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware])
  })

  it('should set all questions to forwarded for specific certificate', () => {
    testStore.dispatch(updateActiveList(getList()))
    testStore.dispatch(updateListItemAsForwarded('id1'))

    const { activeList } = testStore.getState().ui.uiList

    expect(activeList[0].values.FORWARDED).toBeTruthy()
    expect(activeList[1].values.FORWARDED).toBeTruthy()
    expect(activeList[2].values.FORWARDED).toBeFalsy()
    expect(activeList[3].values.FORWARDED).toBeFalsy()
  })
})
