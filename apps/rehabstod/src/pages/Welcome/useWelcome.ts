import { useMemo } from 'react'
import { useGetMedarbetarUppdragQuery, useGetPersonQuery } from '../../store/hsaApi'
import { MedarbetarUppdrag } from '../../store/types/medarbertarUppdrag'
import { Person } from '../../store/types/person'

export function useWelcome() {
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
    () => missions.map(({ hsaId, fakeProperties }) => ({ hsaId, ...fakeProperties, logins: fakeProperties?.logins ?? [] })),
    [missions]
  )

  return { isLoading, fakeLogins, missions }
}
