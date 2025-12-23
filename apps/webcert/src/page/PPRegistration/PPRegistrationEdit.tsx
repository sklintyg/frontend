import { isEqual } from 'lodash-es'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommonLayout from '../../components/commonLayout/CommonLayout'
import WebcertHeader from '../../components/header/WebcertHeader'
import { CustomButton } from '../../components/Inputs/CustomButton'
import { ConfirmModal } from '../../components/utils/Modal/ConfirmModal'
import Spinner from '../../components/utils/Spinner'
import { useLogout } from '../../hooks/useLogout'
import { useGetPrivatePractitionerQuery, useUpdatePrivatePractitionerMutation } from '../../store/pp/ppApi'
import { validateData as validateStep01Data } from '../../store/pp/ppStep01ReducerSlice'
import { validateData as validateStep02Data } from '../../store/pp/ppStep02ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import { ResourceLinkType } from '../../types'
import { ResourceAccess } from '../../utils/ResourceAccess'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { PPFieldset } from './components/PPFieldset'
import { PPPage } from './components/PPPage'
import { PPStep01Fields } from './components/PPStep01/PPStep01Fields'
import { PPStep01Intro } from './components/PPStep01/PPStep01Intro'
import { PPStep02Fields } from './components/PPStep02/PPStep02Fields'
import { PPStep02Intro } from './components/PPStep02/PPStep02Intro'
import { PPStep03Fields } from './components/PPStep03/PPStep03Fields'
import { PPStep03Intro } from './components/PPStep03/PPStep03Intro'
import { PPSubHeader } from './components/PPSubHeader'
import { StatusBox } from './components/StatusBox'

function PPRegistrationEdit() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useGetPrivatePractitionerQuery()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const { position, careUnitName, typeOfCare, healthcareServiceType, workplaceCode } = useAppSelector(
    (state) => state.ui.pp.step01.data,
    isEqual
  )
  const { phoneNumber, email, address, zipCode, city, county, municipality } = useAppSelector((state) => state.ui.pp.step02.data, isEqual)

  const [trigger, { isLoading: isLoadingRegistration, isError: isRegistrationError }] = useUpdatePrivatePractitionerMutation()
  const { logout } = useLogout()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <PPPage>
      <ConfirmModal
        modalTitle="Dina uppgifter sparas inte"
        confirmButtonText="Ja, lämna sidan"
        declineButtonText="Nej, stanna kvar"
        disabled={false}
        onConfirm={() => {
          navigate('/')
        }}
        open={showCancelModal}
        setOpen={setShowCancelModal}
      >
        Om du lämnar sidan sparas inte dina ändringar. Vill du avbryta?
      </ConfirmModal>

      <PPStep01Intro />
      <PPFieldset>
        <PPStep01Fields />
      </PPFieldset>
      <PPStep02Intro />
      <PPFieldset>
        <PPStep02Fields />
      </PPFieldset>
      <PPStep03Intro />
      <PPFieldset>
        <PPStep03Fields />
      </PPFieldset>

      <StatusBox type="INFO">
        För att ändringarna ska visas i nya intyg som du skapar måste du spara och logga ut och sedan logga in i Webcert igen. Ändringarna
        kommer inte att visas på redan signerade intyg.
      </StatusBox>

      {isRegistrationError && (
        <StatusBox type="ERROR">
          Ett tekniskt fel har uppstått. Kontot kan inte sparas. Försök igen senare. Om problemet kvarstår, kontakta{' '}
          <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />
        </StatusBox>
      )}

      <div className="flex gap-5">
        <CustomButton onClick={() => setShowCancelModal(true)}>Avbryt</CustomButton>
        <CustomButton
          buttonStyle="primary"
          onClick={() => {
            if (isLoadingRegistration) {
              return null
            }

            dispatch(validateStep01Data())
            dispatch(validateStep02Data())
            const step01Errors = store.getState().ui.pp.step01.errors
            const step02Errors = store.getState().ui.pp.step02.errors

            const errors = Object.keys({ ...step01Errors, ...step02Errors })
            if (errors.length > 0) {
              document.getElementById(errors[0])?.focus()
            } else {
              trigger({
                address,
                careUnitName,
                city,
                county,
                email,
                healthcareServiceType,
                municipality,
                phoneNumber,
                position,
                typeOfCare,
                workplaceCode,
                zipCode,
              })
                .unwrap()
                .then(() => logout())
                .catch(() => {
                  // Error is handled by isRegistrationError state
                })
            }
          }}
        >
          Spara och logga ut
        </CustomButton>
      </div>
    </PPPage>
  )
}

export function PPRegistraionEditWithRedirect() {
  return (
    <ResourceAccess linkType={ResourceLinkType.ACCESS_EDIT_PRIVATE_PRACTITIONER}>
      <CommonLayout header={<WebcertHeader />} subHeader={<PPSubHeader type="edit">Ändra uppgifter</PPSubHeader>}>
        <PPRegistrationEdit />
      </CommonLayout>
    </ResourceAccess>
  )
}
