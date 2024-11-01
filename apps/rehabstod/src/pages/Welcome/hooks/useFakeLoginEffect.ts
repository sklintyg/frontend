import { useEffect, useMemo, useState } from 'react'
import type { MedarbetarUppdrag, Person } from '../../../schemas/hsa'
import { AllowedInApplication } from '../../../schemas/hsa'
import { useGetMedarbetarUppdragQuery, useGetPersonQuery } from '../../../store/hsaApi'

interface FakeLoginData {
  hsaId: string
  forvaldEnhet: string
  beskrivning: string
}

export function useFakeLoginEffect() {
  const defaultHsaId = 'TSTNMT2321000156-VAAA'
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedLogin, setSelectedLogin] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')

  const { isLoading: isLoadingMedarbetarUppdrag, data: medarbetarUppdrag, error: medarbetarUppdragError } = useGetMedarbetarUppdragQuery()
  const { isLoading: isLoadingPerson, data: people, error: peopleError } = useGetPersonQuery()
  const isLoading = isLoadingMedarbetarUppdrag || isLoadingPerson

  const missions = useMemo(
    () =>
      medarbetarUppdrag && people
        ? medarbetarUppdrag.reduce<(Person & MedarbetarUppdrag)[]>((result, mission) => {
            const person = people.find((p) => mission.hsaId === p.hsaId)
            if (person) {
              return [...result, { ...person, ...mission }]
            }
            return result
          }, [])
        : [],
    [medarbetarUppdrag, people]
  )

  const serverLogins: FakeLoginData[] = useMemo(
    () =>
      missions
        .map(({ hsaId, fakeProperties }) => ({ hsaId, ...fakeProperties, logins: fakeProperties?.logins ?? [] }))
        .filter(
          ({ allowedInApplications }) => allowedInApplications?.includes(AllowedInApplication.RS) || allowedInApplications?.length === 0
        )
        .sort((a, b) => a.logins[0].beskrivning.localeCompare(b.logins[0].beskrivning))
        .filter(({ env }) => (selectedFilter === 'all' ? true : selectedFilter === env))
        .map(({ hsaId, logins }) => logins.map(({ forvaldEnhet, beskrivning }) => ({ hsaId, forvaldEnhet, beskrivning })))
        .flat(),
    [missions, selectedFilter]
  )

  const fakeLogins = useMemo(() => {
    const fallBackLogins: FakeLoginData[] = [
      {
        hsaId: defaultHsaId,
        forvaldEnhet: 'TSTNMT2321000156-ALMC',
        beskrivning: 'Ajla Doktor (Läkare)',
      },
    ]
    return serverLogins.length > 0 ? serverLogins : fallBackLogins
  }, [serverLogins])

  useEffect(() => {
    if (fakeLogins.length > 0) {
      const preferedDefault = fakeLogins.find(({ hsaId }) => hsaId === defaultHsaId)
      setSelectedLogin(preferedDefault?.hsaId ?? fakeLogins[0].hsaId)
      setSelectedUnit(preferedDefault?.forvaldEnhet ?? fakeLogins[0].forvaldEnhet)
    }
  }, [fakeLogins])

  return {
    isLoading,
    fakeLogins,
    missions,
    selectedFilter,
    selectedLogin,
    selectedUnit,
    setSelectedFilter,
    setSelectedLogin,
    setSelectedUnit,
    error: medarbetarUppdragError || peopleError,
  }
}
