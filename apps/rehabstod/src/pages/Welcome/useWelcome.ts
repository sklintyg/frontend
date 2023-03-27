import { AllowedInApplication, MedarbetarUppdrag, Person } from '@frontend/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetMedarbetarUppdragQuery, useGetPersonQuery } from '../../store/hsaApi'
import { RootState } from '../../store/store'

export function useWelcome() {
  const { selectedFilter } = useSelector((state: RootState) => state.welcome)
  const { isLoading: isLoadingMedarbetarUppdrag, data: medarbetarUppdrag } = useGetMedarbetarUppdragQuery()
  const { isLoading: isLoadingPerson, data: people } = useGetPersonQuery()
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

  const fakeLogins = useMemo(
    () =>
      missions
        .map(({ hsaId, fakeProperties }) => ({ hsaId, ...fakeProperties, logins: fakeProperties?.logins ?? [] }))
        .filter(({ allowedInApplications }) => allowedInApplications?.includes(AllowedInApplication.RS))
        .filter(({ env }) => (selectedFilter === 'all' ? true : selectedFilter === env))
        .map(({ hsaId, logins }) => logins.map(({ forvaldEnhet, beskrivning }) => ({ hsaId, forvaldEnhet, beskrivning })))
        .flat(),
    [missions, selectedFilter]
  )

  return { isLoading, fakeLogins, missions }
}
