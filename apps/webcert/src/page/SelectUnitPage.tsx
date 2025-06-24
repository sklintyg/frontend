import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import AppHeader from '../components/AppHeader/AppHeader'
import CommonLayout from '../components/commonLayout/CommonLayout'
import ExpandableTableRow from '../components/Table/ExpandableTableRow'
import SimpleTable from '../components/Table/SimpleTable'
import ModalBase from '../components/utils/Modal/ModalBase'
import logo from '../images/webcert_logo.png'
import { useAppSelector } from '../store/store'
import { getUser } from '../store/user/userActions'
import { getCareProviders, getSelectUnitHeading } from '../store/user/userSelectors'
import type { CareUnit, Unit } from '../types'

const ModalBaseLarge = styled(ModalBase)`
  max-width: 55rem;
`

function getUnitResumeUrl(certificateId: string, unit: CareUnit | Unit) {
  return `/visa/intyg/${certificateId}/resume?enhet=${unit.unitId}`
}

function SelectUnitRow({ unit, certificateId }: { unit: CareUnit | Unit; certificateId: string }) {
  return (
    <tr key={unit.unitId}>
      <td>
        <a href={getUnitResumeUrl(certificateId, unit)}>{unit.unitName}</a>
      </td>
    </tr>
  )
}

export function SelectUnitPage() {
  const { certificateId } = useParams<{ certificateId: string }>()
  const user = useAppSelector(getUser)
  const modalTitle = useAppSelector(getSelectUnitHeading)
  const careProviders = useAppSelector(getCareProviders)

  if (!user || !certificateId) {
    return null
  }

  return (
    <CommonLayout header={<AppHeader logo={logo} alt={'Logo Webcert'} />}>
      <ModalBaseLarge
        title={modalTitle}
        open={true}
        focusTrap={false}
        content={
          <>
            {careProviders.map((careProvider) => (
              <SimpleTable
                key={careProvider.id}
                headings={[
                  {
                    title: careProvider.missingSubscription ? `${careProvider.name} (Abonnemang saknas)` : careProvider.name,
                    adjustCellToText: false,
                  },
                ]}
              >
                {careProvider.careUnits.map((careUnit) =>
                  careUnit.units.length > 0 ? (
                    <ExpandableTableRow
                      key={careUnit.unitId}
                      rowContent={[careUnit.unitName]}
                      id={careUnit.unitId}
                      handleClick={() => {
                        window.location.replace(getUnitResumeUrl(certificateId, careUnit))
                      }}
                      disabled={false}
                    >
                      {careUnit.units.map((unit) => (
                        <SelectUnitRow key={unit.unitId} certificateId={certificateId} unit={unit} />
                      ))}
                    </ExpandableTableRow>
                  ) : (
                    <SelectUnitRow key={careUnit.unitId} certificateId={certificateId} unit={careUnit} />
                  )
                )}
              </SimpleTable>
            ))}
          </>
        }
        handleClose={() => {
          throw new Error('Function not implemented.')
        }}
        buttons={undefined}
        closeOnBackdropClick={false}
      />
    </CommonLayout>
  )
}
