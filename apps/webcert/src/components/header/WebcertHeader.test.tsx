import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { fakeCareProvider, fakeResourceLink, fakeUnit, fakeUser } from '../../faker'
import store from '../../store/store'
import { updateUser, updateUserResourceLinks } from '../../store/user/userActions'
import { ResourceLinkType, Unit, User } from '../../types'
import WebcertHeader from './WebcertHeader'

const getUserWithMissingSubscription = (): User => {
  const unit: Unit = fakeUnit({
    unitName: 'Care Provider',
    isInactive: true,
  })

  return fakeUser({
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: unit,
    careProviders: [
      fakeCareProvider({
        id: unit.unitId,
        name: unit.unitName,
        missingSubscription: true,
      }),
    ],
  })
}

const renderComponent = () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <WebcertHeader />
      </BrowserRouter>
    </Provider>
  )
}

describe('WebcertHeader', () => {
  it('should render component', () => {
    renderComponent()
  })

  it('should display about Webcert', () => {
    renderComponent()
    expect(screen.getByText('Om Webcert')).toBeInTheDocument()
  })

  it('should display logout link if resource link exists', () => {
    renderComponent()
    store.dispatch(
      updateUserResourceLinks([
        {
          type: ResourceLinkType.LOG_OUT,
          name: 'Logga ut',
          body: '',
          description: '',
          enabled: true,
        },
      ])
    )

    expect(screen.getByText('Logga ut')).toBeInTheDocument()
  })

  it('should display subscription warning banner when care provider has no subscription', () => {
    store.dispatch(updateUser(getUserWithMissingSubscription()))
    renderComponent()

    expect(
      screen.getByText(
        'Abonnemang för Webcert saknas. Du har endast tillgång till Webcert för att läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.'
      )
    ).toBeInTheDocument()
  })

  it('should display warning normal origin banner when user has resource link', () => {
    store.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.WARNING_NORMAL_ORIGIN })]))
    store.dispatch(updateUser(getUserWithMissingSubscription()))
    renderComponent()
    const expectedValue =
      'Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem. Care Provider har integrerat sitt journalsystem med Webcert. Om du skapar intyg i fristående Webcert kommer intygen inte synkroniseras med journalsystemet.'

    expect(screen.getByText(expectedValue)).toBeInTheDocument()
  })

  it('should not display warning normal origin banner when user has no resource link', () => {
    store.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.ANSWER_QUESTION })]))
    store.dispatch(updateUser(getUserWithMissingSubscription()))
    renderComponent()
    const expectedValue =
      'Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem. Care Provider har integrerat sitt journalsystem med Webcert. Om du skapar intyg i fristående Webcert kommer intygen inte synkroniseras med journalsystemet.'

    expect(screen.queryByText(expectedValue)).not.toBeInTheDocument()
  })

  it('should display both warning normal origin banner & subscription warning banner', () => {
    store.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.WARNING_NORMAL_ORIGIN })]))
    store.dispatch(updateUser(getUserWithMissingSubscription()))
    renderComponent()
    const expectedValueOriginBanner =
      'Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem. Care Provider har integrerat sitt journalsystem med Webcert. Om du skapar intyg i fristående Webcert kommer intygen inte synkroniseras med journalsystemet.'
    const expectedSubscriptionBanner =
      'Abonnemang för Webcert saknas. Du har endast tillgång till Webcert för att läsa, skriva ut och makulera eventuella tidigare utfärdade intyg.'

    expect(screen.getByText(expectedValueOriginBanner)).toBeInTheDocument()
    expect(screen.getByText(expectedSubscriptionBanner)).toBeInTheDocument()
  })
})
