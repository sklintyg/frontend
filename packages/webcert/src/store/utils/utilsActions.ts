import { createAction } from '@reduxjs/toolkit'
import { DynamicLinkMap } from './utilsReducer'

export const getAllDynamicLinks = createAction('[Utils] Get all dynamic links')
export const getAllDynamicLinksStarted = createAction('[Utils] Get all dynamic links started')
export const getAllDynamicLinksSuccess = createAction<DynamicLinkMap>('[Utils] Get all dynamic links success')
export const getAllDynamicLinksError = createAction<string>('[Utils] Get all dynamic links error')

export const updateDynamicLinks = createAction<DynamicLinkMap>('[Utils] Update dynamic links')
