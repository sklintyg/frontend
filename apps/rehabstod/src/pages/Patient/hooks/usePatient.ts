import { createContext, useContext, useState } from 'react'
import { useGetConfigQuery } from '../../../store/api'

export function usePatientState() {
  const { data: config } = useGetConfigQuery()
  const [tabs, setTabs] = useState<Window[]>([])
  const openTabs = tabs.filter((window) => !window.closed)
  const hasOpenTabs = openTabs.length > 0

  const navigateToWebcert = (id: string) => {
    const tab = window.open((config?.webcertLaunchUrlTemplate ?? '').replace('{id}', id), '_blank')
    if (tab) {
      setTabs([...tabs, tab])
    }
  }

  const closeTabs = () => {
    tabs.forEach((tab) => tab.close())
    setTabs([])
  }

  return { navigateToWebcert, hasOpenTabs, closeTabs, tabs: openTabs }
}

export const PatientContext = createContext<ReturnType<typeof usePatientState> | null>(null)

export const usePatient = () => {
  const context = useContext(PatientContext)

  if (context == null) {
    throw new Error('Patient components must be wrapped in <PatientContext.Provider />')
  }

  return context
}
