import { IDSButton } from '@frontend/ids-react-ts'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { Table } from '../../components/Table/Table'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { UnansweredCommunicationAlert } from '../../components/error/ErrorAlert/UnansweredCommunicationAlert'
import { UserUrval } from '../../schemas'
import { useGetSickLeavesFiltersQuery, useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'
import { reset, resetFilters } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeavesInfo, error }] = useLazyGetSickLeavesQuery()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const { encryptedPatientId } = useParams()
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: SickLeaveColumn.Startdatum,
    ascending: true,
  })
  const dispatch = useAppDispatch()
  const isLoading = userLoading || currentSickLeaveLoading
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME
  const navigate = useNavigate()
  const normalHeader = useRef<HTMLTableSectionElement>(null)
  const fixedHeader = useRef<HTMLTableSectionElement>(null)
  const outerDiv = useRef<HTMLDivElement>(null)
  const innerDiv = useRef<HTMLDivElement>(null)
  const sickLeaves = currentSickLeavesInfo ? currentSickLeavesInfo.content : undefined

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/')
    }
  }, [user, userLoading, navigate])

  useEffect(() => {
    const handleScroll = () => {
      document.getElementById('scrollDiv')?.addEventListener('scroll', handleScroll)
      if (normalHeader.current && fixedHeader.current && outerDiv.current && innerDiv.current) {
        const { top, width } = normalHeader.current.getBoundingClientRect()
        const contentWidth = document.getElementById('contentDiv')?.getBoundingClientRect().width
        const bottom = document.getElementById('contentDiv')?.getBoundingClientRect().bottom
        const scrollLeft = document.getElementById('scrollDiv')?.scrollLeft
        if (top < 0 && bottom && bottom > 50) {
          innerDiv.current.style.width = `${width + (scrollLeft ?? 0)}px`
          outerDiv.current.style.width = `${width}px`
          fixedHeader.current.style.width = `${contentWidth}px`
          fixedHeader.current.classList.remove('hidden')
        } else {
          fixedHeader.current.classList.add('hidden')
        }
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  if (encryptedPatientId) {
    return <Outlet />
  }

  const TABLE_NAME = 'pågående sjukfall'

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      <TableHeadingForUnit user={user} tableName="pågående sjukfall" />
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <Filters
        onSearch={(request) => triggerGetSickLeaves(request)}
        onReset={() => {
          dispatch(resetFilters())
        }}
        isDoctor={isDoctor}
      />
      {populatedFilters?.nbrOfSickLeaves === 0 && <EmptyTableAlert tableName={TABLE_NAME} />}
      {error && <TableContentAlert tableName="sjukfall" error={error} />}
      {!error && (
        <div>
          <div className="pb-10">{currentSickLeavesInfo?.unansweredCommunicationError && <UnansweredCommunicationAlert />}</div>
          <div className="flex">
            <div className="w-full">
              <CurrentSickLeavesTableInfo
                onShowPersonalInformationChange={(checked) => {
                  dispatch(updateShowPersonalInformation(checked))
                }}
                showPersonalInformation={showPersonalInformation}
                totalNumber={populatedFilters?.nbrOfSickLeaves ?? 0}
                listLength={(sickLeaves ?? []).length}
                daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
                daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
              />
            </div>

            <div className="mb-5 flex items-end gap-3 print:hidden">
              <div className="w-96">
                <ModifySicknessTableColumns />
              </div>
              <IDSButton onClick={() => window.print()} className="mb-3 whitespace-nowrap">
                Skriv ut
              </IDSButton>
            </div>
          </div>
          <Table
            sortColumn={tableState.sortColumn}
            onSortChange={setTableState}
            print={<PrintTable sickLeaves={sickLeaves} showPersonalInformation={showPersonalInformation} />}
            ascending={tableState.ascending}
          >
            <thead ref={normalHeader}>
              <TableHeaderRow showPersonalInformation={showPersonalInformation} isDoctor={isDoctor} />
            </thead>
            <thead ref={fixedHeader} className="fixed top-0 z-20 hidden overflow-hidden">
              <div ref={outerDiv} className="mx-auto">
                <div ref={innerDiv} className="float-right">
                  <TableHeaderRow showPersonalInformation={showPersonalInformation} isDoctor={isDoctor} />
                </div>
              </div>
            </thead>
            <tbody className="whitespace-normal break-words">
              <TableBodyRows
                isDoctor={isDoctor}
                isLoading={isLoading}
                showPersonalInformation={showPersonalInformation}
                sickLeaves={sickLeaves}
                user={user}
              />
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}
