import { useMemo } from 'react'
import { AllowedInApplication, MedarbetarUppdrag, Person } from '../../schemas/hsa'
import { useAppSelector } from '../../store/hooks'
import { useGetMedarbetarUppdragQuery, useGetPersonQuery } from '../../store/hsaApi'

export function useWelcome() {
  const { selectedFilter } = useAppSelector((state) => state.welcome)
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
        .filter(
          ({ allowedInApplications }) => allowedInApplications?.includes(AllowedInApplication.RS) || allowedInApplications?.length === 0
        )
        .sort((a, b) => a.logins[0].beskrivning.localeCompare(b.logins[0].beskrivning))
        .filter(({ env }) => (selectedFilter === 'all' ? true : selectedFilter === env))
        .map(({ hsaId, logins }) => logins.map(({ forvaldEnhet, beskrivning }) => ({ hsaId, forvaldEnhet, beskrivning })))
        .flat(),
    [missions, selectedFilter]
  )

  return { isLoading, fakeLogins, missions }
}
